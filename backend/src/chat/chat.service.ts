import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomDto } from './chat-room.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createCharRoom(coffeeChatId: number) {
    const existing = await this.prisma.chatRoom.findFirst({
      where: { coffeeChatId },
    });

    if (existing) return existing;

    return this.prisma.chatRoom.create({
      data: { coffeeChatId },
    });
  }

  async validateRoomAccess(chatRoomId: number, userId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: { coffeeChat: true },
    });

    if (!room) throw new NotFoundException('ChatRoom not found');

    const { coffeeChat } = room;
    const isParticipant =
      coffeeChat.mentorId === userId || coffeeChat.menteeId === userId;

    if (!isParticipant) throw new ForbiddenException('Access denied');

    return room;
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    const normalized = content?.trim();

    if (!normalized) throw new BadRequestException('Empty message');

    return this.prisma.message.create({
      data: { chatRoomId, senderId, content: normalized },
    });
  }

  async getChatRoomsForUser(
    userId: number,
    userRole: string,
  ): Promise<ChatRoomDto[]> {
    const roleFilterMap: Record<string, object> = {
      MENTOR: { mentorId: userId },
      MENTEE: { menteeId: userId },
    };

    const filter = roleFilterMap[userRole];
    if (!filter) throw new ForbiddenException('Invalid user role');

    type ChatRoomWithRelations = {
      id: number;
      updatedAt: Date;
      coffeeChat: { mentor: { name: string } };
      messages: { content: string }[];
    };

    const chatRooms: ChatRoomWithRelations[] =
      await this.prisma.chatRoom.findMany({
        where: { coffeeChat: filter },
        select: {
          id: true,
          updatedAt: true,
          coffeeChat: {
            select: {
              mentor: { select: { name: true } },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { content: true },
          },
        },
      });

    return chatRooms.map((room) => ({
      id: room.id,
      mentorName: room.coffeeChat.mentor.name,
      lastMessage: room.messages[0]?.content ?? null,
      updatedAt: room.updatedAt,
    }));
  }

  async getMessages(roomId: number) {
    const messages = await this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderId: true,
        content: true,
        createdAt: true,
        sender: {
          select: { name: true },
        },
      },
    });

    return messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.name,
      content: m.content,
      createdAt: m.createdAt,
    }));
  }
}
