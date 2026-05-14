import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoffeeChatStatus } from '@prisma/client';

type CreateCoffeeChatInput = {
  timeSlotId: number;
  menteeId: number;
};
@Injectable()
export class CoffeechatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCoffeeChat(input: CreateCoffeeChatInput) {
    const slot = await this.prisma.mentorTimeSlot.findUnique({
      where: {
        id: input.timeSlotId,
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    if (slot.isReserved) {
      throw new BadRequestException('Slot already reserved');
    }

    if (slot.mentorId === input.menteeId) {
      throw new ForbiddenException('Self reservation not allowed');
    }

    const mentee = await this.prisma.user.findUnique({
      where: {
        id: input.menteeId,
      },
    });

    if (!mentee || mentee.role !== 'MENTEE') {
      throw new ForbiddenException('Mentee only');
    }

    const existing = await this.prisma.coffeeChat.findFirst({
      where: {
        timeSlotId: input.timeSlotId,
      },
    });

    if (existing) {
      throw new BadRequestException('Duplicate reservation');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.mentorTimeSlot.update({
        where: {
          id: input.timeSlotId,
        },
        data: {
          isReserved: true,
        },
      });
      return tx.coffeeChat.create({
        data: {
          mentorId: slot.mentorId,
          menteeId: input.menteeId,
          timeSlotId: input.timeSlotId,
          status: CoffeeChatStatus.PENDING,
        },
      });
    });
    return result;
  }
}
