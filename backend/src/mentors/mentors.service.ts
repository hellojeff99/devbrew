import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class MentorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMentors() {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.MENTOR,
      },

      select: {
        id: true,
        email: true,
        name: true,
        headline: true,
        bio: true,
        techStack: true,
        createdAt: true,
      },
    });
  }

  async findMentorById(id: number) {
    const mentor = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRole.MENTOR,
      },

      select: {
        id: true,
        email: true,
        name: true,
        headline: true,
        bio: true,
        techStack: true,
        createdAt: true,
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    return mentor;
  }
}
