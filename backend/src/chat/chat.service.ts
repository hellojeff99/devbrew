import { Injectable } from '@nestjs/common';
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
}
