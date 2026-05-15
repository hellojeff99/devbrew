import {
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
}
