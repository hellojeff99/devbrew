# Database Schema Specification

## 1. 개요

본 프로젝트는 PostgreSQL을 기반으로 하며, Prisma ORM을 사용하여 데이터베이스 모델을 정의합니다. 멘토와 멘티 간의 커피챗 예약 및 실시간 채팅 기능을 지원하는 구조입니다.

------

## 2. 테이블 정의 (Models)

### `User` (사용자)

시스템의 모든 사용자(멘토/멘티) 정보를 저장합니다.

- **id** (`Int`, PK): 자동 증가 고유 식별자
- **email** (`String`): 사용자 이메일 (Unique)
- **password** (`String`): 암호화된 비밀번호
- **name** (`String`): 사용자 이름
- **role** (`UserRole`): 사용자 역할 (`MENTOR`, `MENTEE`)
- **headline** (`String`, Optional): 한 줄 소개
- **bio** (`String`, Optional): 상세 프로필
- **techStack** (`String[]`): 기술 스택 배열
- **createdAt** (`DateTime`): 계정 생성일 (기본값: 현재 시간)

### `MentorTimeSlot` (멘토 가능 시간대)

멘토가 오픈한 커피챗 가능 시간대 정보입니다.

- **id** (`Int`, PK): 자동 증가 고유 식별자
- **mentorId** (`Int`, FK): `User.id` 참조 (시간대를 생성한 멘토)
- **startTime** (`DateTime`): 커피챗 시작 시간
- **isReserved** (`Boolean`): 예약 여부 (기본값: `false`)
- **createdAt** (`DateTime`): 생성일

### `CoffeeChat` (커피챗 신청/예약)

멘티가 멘토의 타임슬롯에 신청한 커피챗 예약 내역입니다.

- **id** (`Int`, PK): 자동 증가 고유 식별자
- **mentorId** (`Int`, FK): `User.id` 참조 (대상 멘토)
- **menteeId** (`Int`, FK): `User.id` 참조 (신청한 멘티)
- **timeSlotId** (`Int`, FK, Unique): `MentorTimeSlot.id` 참조 (선택한 시간대)
- **status** (`CoffeeChatStatus`): 예약 상태 (`PENDING`, `APPROVED`, `REJECTED`)
- **createdAt** (`DateTime`): 신청일

### `ChatRoom` (채팅방)

커피챗이 승인되거나 매칭되었을 때 활성화되는 채팅방입니다.

- **id** (`Int`, PK): 자동 증가 고유 식별자
- **coffeeChatId** (`Int`, FK, Unique): `CoffeeChat.id` 참조 (연결된 커피챗)
- **createdAt** (`DateTime`): 생성일
- **updatedAt** (`DateTime`): 마지막 수정일 (자동 갱신)

### `Message` (채팅 메시지)

채팅방 내부에서 주고받은 메시지 내역입니다.

- **id** (`Int`, PK): 자동 증가 고유 식별자
- **chatRoomId** (`Int`, FK): `ChatRoom.id` 참조 (소속된 채팅방)
- **senderId** (`Int`, FK): `User.id` 참조 (발신자)
- **content** (`String`): 메시지 내용
- **createdAt** (`DateTime`): 발신 시간

------

## 3. 열거형 타입 (Enums)

### `UserRole`

| **값**   | **설명**             |
| -------- | -------------------- |
| `MENTOR` | 지식을 공유하는 멘토 |
| `MENTEE` | 조언을 구하는 멘티   |

### `CoffeeChatStatus`

| **값**     | **설명**                        |
| ---------- | ------------------------------- |
| `PENDING`  | 멘티의 커피챗 신청 후 대기 상태 |
| `APPROVED` | 멘토가 신청을 수락한 상태       |
| `REJECTED` | 멘토가 신청을 거절한 상태       |

------

## 4. 데이터 관계 요약 (Relations)

- **User ↔ MentorTimeSlot** (`1:N`): 한 명의 멘토는 여러 개의 가능 시간대를 생성할 수 있습니다.
- **User ↔ CoffeeChat** (`1:N`): 한 명의 사용자는 멘토 또는 멘티로서 여러 커피챗 내역을 가질 수 있습니다.
- **MentorTimeSlot ↔ CoffeeChat** (`1:1`): 하나의 타임슬롯은 하나의 커피챗 예약과 연결됩니다.
- **CoffeeChat ↔ ChatRoom** (`1:1`): 하나의 커피챗 신청 건은 하나의 채팅방을 가질 수 있습니다.
- **ChatRoom ↔ Message** (`1:N`): 하나의 채팅방에는 여러 개의 메시지가 존재합니다.
- **User ↔ Message** (`1:N`): 한 명의 사용자는 여러 개의 메시지를 보낼 수 있습니다.