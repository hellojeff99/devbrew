import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'mentor1@test.com',
        password: '1234',
        name: 'Mentor One',
        role: UserRole.MENTOR,
        headline: 'Backend Engineer',
        bio: 'NestJS Mentor',
        techStack: ['NestJS', 'Prisma', 'PostgreSQL'],
      },
      {
        email: 'mentor2@test.com',
        password: '1234',
        name: 'Mentor Two',
        role: UserRole.MENTOR,
        headline: 'Frontend Engineer',
        bio: 'Next.js Mentor',
        techStack: ['Next.js', 'React', 'TypeScript'],
      },
      {
        email: 'mentee1@test.com',
        password: '1234',
        name: 'Mentee One',
        role: UserRole.MENTEE,
        techStack: ['JavaScript'],
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
