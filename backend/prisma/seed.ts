import { CoffeeChatStatus, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 전체 초기화 (FK 순서 맞춰서)
  await prisma.message.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.coffeeChat.deleteMany();
  await prisma.mentorTimeSlot.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // 멘토 생성
  const mentors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'jihun@devbrew.com',
        password,
        name: '김지훈',
        role: UserRole.MENTOR,
        headline: '토스 | 5년차 백엔드 엔지니어',
        bio: 'Java와 Spring을 주로 사용하며, 대용량 트래픽 처리와 시스템 설계에 관심이 많습니다. 취준생 분들의 기술 면접과 커리어 방향 설정을 도와드리고 싶어요.',
        techStack: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'AWS'],
      },
    }),
    prisma.user.create({
      data: {
        email: 'suyeon@devbrew.com',
        password,
        name: '이수연',
        role: UserRole.MENTOR,
        headline: '라인 | 플랫폼 개발팀',
        bio: 'Kotlin과 MSA 아키텍처를 다루고 있어요. 개발자로서의 성장 방향과 회사 선택 기준에 대해 이야기 나눌 수 있어요.',
        techStack: ['Kotlin', 'Spring', 'Docker', 'Kubernetes', 'Redis'],
      },
    }),
    prisma.user.create({
      data: {
        email: 'minjun@devbrew.com',
        password,
        name: '박민준',
        role: UserRole.MENTOR,
        headline: '카카오 | AI 서비스 개발',
        bio: 'Python과 FastAPI 기반의 AI 서비스를 개발하고 있어요. ML 엔지니어링과 백엔드 개발 경계에 있는 포지션에 대해 이야기할 수 있어요.',
        techStack: ['Python', 'FastAPI', 'PyTorch', 'AWS', 'PostgreSQL'],
      },
    }),
  ]);

  // 멘티 생성
  const mentees = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@devbrew.com',
        password,
        name: '정앨리스',
        role: UserRole.MENTEE,
        techStack: ['Java', 'Spring Boot'],
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@devbrew.com',
        password,
        name: '이밥',
        role: UserRole.MENTEE,
        techStack: ['Python', 'Django'],
      },
    }),
  ]);

  // 타임슬롯 생성 (멘토별 3개씩)
  const now = new Date();
  const slot = (days: number, hours: number) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + days,
      hours,
      0,
      0,
    );

  const slots = await Promise.all([
    // 김지훈 슬롯
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[0].id, startTime: slot(1, 10) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[0].id, startTime: slot(2, 14) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[0].id, startTime: slot(3, 16) },
    }),
    // 이수연 슬롯
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[1].id, startTime: slot(1, 13) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[1].id, startTime: slot(2, 15) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[1].id, startTime: slot(4, 11) },
    }),
    // 박민준 슬롯
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[2].id, startTime: slot(1, 9) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[2].id, startTime: slot(3, 14) },
    }),
    prisma.mentorTimeSlot.create({
      data: { mentorId: mentors[2].id, startTime: slot(5, 10) },
    }),
  ]);

  // 커피챗 생성 (APPROVED + 채팅방 + 메시지)
  const coffeeChat1 = await prisma.coffeeChat.create({
    data: {
      mentorId: mentors[0].id,
      menteeId: mentees[0].id,
      timeSlotId: slots[0].id,
      status: CoffeeChatStatus.APPROVED,
    },
  });
  await prisma.mentorTimeSlot.update({
    where: { id: slots[0].id },
    data: { isReserved: true },
  });

  const chatRoom1 = await prisma.chatRoom.create({
    data: { coffeeChatId: coffeeChat1.id },
  });

  await prisma.message.createMany({
    data: [
      {
        chatRoomId: chatRoom1.id,
        senderId: mentees[0].id,
        content: '안녕하세요! 백엔드 커리어에 대해 여쭤봐도 될까요?',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        chatRoomId: chatRoom1.id,
        senderId: mentors[0].id,
        content: '물론이죠! 어떤 부분이 궁금하신가요?',
        createdAt: new Date(Date.now() - 1000 * 60 * 8),
      },
      {
        chatRoomId: chatRoom1.id,
        senderId: mentees[0].id,
        content: 'Java 백엔드로 취업하려면 Spring 외에 뭘 더 준비해야 할까요?',
        createdAt: new Date(Date.now() - 1000 * 60 * 6),
      },
      {
        chatRoomId: chatRoom1.id,
        senderId: mentors[0].id,
        content:
          'JPA와 쿼리 최적화, 그리고 시스템 설계 기초를 함께 준비하시면 좋아요. 특히 인덱스 개념은 면접에 자주 나와요.',
        createdAt: new Date(Date.now() - 1000 * 60 * 4),
      },
    ],
  });

  // PENDING 커피챗
  await prisma.coffeeChat.create({
    data: {
      mentorId: mentors[1].id,
      menteeId: mentees[1].id,
      timeSlotId: slots[3].id,
      status: CoffeeChatStatus.PENDING,
    },
  });
  await prisma.mentorTimeSlot.update({
    where: { id: slots[3].id },
    data: { isReserved: true },
  });

  console.log('Seed 완료');
  console.log(
    '멘토 계정: jihun@devbrew.com / suyeon@devbrew.com / minjun@devbrew.com',
  );
  console.log('멘티 계정: alice@devbrew.com / bob@devbrew.com');
  console.log('공통 비밀번호: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
