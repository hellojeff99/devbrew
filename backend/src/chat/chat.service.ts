import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createCharRoom(coffeeChatId: number) {
    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        coffeeChatId,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.chatRoom.create({
      data: {
        coffeeChatId,
      },
    });
  }

  async validateRoomAccess(chatRoomId: number, userId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        coffeeChat: true,
      },
    });

    if (!room) {
      throw new NotFoundException('ChatRoom not found');
    }

    const { coffeeChat } = room;

    const isParticipant =
      coffeeChat.mentorId === userId || coffeeChat.menteeId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Access denied');
    }

    return room;
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    const normalized = content?.trim();

    if (!normalized) {
      throw new BadRequestException('Empty message');
    }

    return this.prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        content: normalized,
      },
    });
  }
}
