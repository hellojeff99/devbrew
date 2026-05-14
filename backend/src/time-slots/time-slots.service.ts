import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

type CreateTimeSlotInput = {
  mentorId: number;
  startTime: string;
};

@Injectable()
export class TimeSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTimeSlot(input: CreateTimeSlotInput) {
    if (input.startTime.trim() === '') {
      throw new BadRequestException('Start time is required');
    }

    const startTime = new Date(input.startTime);

    if (Number.isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid datetime');
    }

    if (startTime <= new Date()) {
      throw new BadRequestException('Past datetime is not allowed');
    }

    const mentor = await this.prisma.user.findUnique({
      where: {
        id: input.mentorId,
      },
    });

    if (!mentor || mentor.role !== UserRole.MENTOR) {
      throw new ForbiddenException('Mentor only');
    }

    const existingSlot = await this.prisma.mentorTimeSlot.findFirst({
      where: {
        mentorId: input.mentorId,
        startTime,
      },
    });

    if (existingSlot) {
      throw new BadRequestException('Duplicate slot already exists');
    }

    return this.prisma.mentorTimeSlot.create({
      data: {
        mentorId: input.mentorId,
        startTime,
      },
    });
  }
}
