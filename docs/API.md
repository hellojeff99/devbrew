# 🚀 API Specification Document

## 1. Auth API (`/auth`)

### 1.1 회원가입

- **Endpoint:** `POST /auth/signup`
- **Authentication:** None
- **Request Body**

```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "홍길동",
  "role": "MENTEE" 
}
```

- **Response** (Success - `201 Created`)

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다."
}
```

### 1.2 로그인

- **Endpoint:** `POST /auth/login`
- **Authentication:** None
- **Request Body**

```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

- **Response** (`200 OK`)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "role": "MENTEE",
    "name": "홍길동"
  }
}
```

### 1.3 내 정보 조회

- **Endpoint:** `GET /auth/me`
- **Authentication:** `JWT Required (JwtAuthGuard)`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response** (`200 OK`)

```json
{
  "user": {
    "sub": 1,
    "role": "MENTEE"
  }
}
```

------

## 2. Chat API (`/chat`)

> 💡 **Note:** Chat API의 모든 엔드포인트는 JWT 인증이 필수입니다.

### 2.1 채팅방 목록 조회

- **Endpoint:** `GET /chat`
- **Authentication:** `JWT Required`
- **Response** (`200 OK`)

```json
{
  "chat": [
    {
      "id": 12,
      "mentorName": "김멘토",
      "lastMessage": "안녕하세요! 내일 커피챗 일정 확인 부탁드립니다.",
      "updatedAt": "2026-05-18T13:00:00.000Z"
    }
  ]
}
```

### 2.2 메시지 조회

- **Endpoint:** `GET /chat/:roomId/messages`
- **Authentication:** `JWT Required`
- **Path Parameters:**
  - `roomId` (number, `ParseIntPipe`)
- **Response** (`200 OK`)

```json
[
  {
    "id": 101,
    "senderId": 1,
    "senderName": "홍길동",
    "content": "안녕하세요 멘토님!",
    "createdAt": "2026-05-18T12:55:00.000Z"
  },
  {
    "id": 102,
    "senderId": 2,
    "senderName": "김멘토",
    "content": "네, 반가워요 홍길동님. 어떤 점이 궁금하신가요?",
    "createdAt": "2026-05-18T13:00:00.000Z"
  }
]
```

------

## 3. CoffeeChats API (`/coffeechats`)

### 3.1 커피챗 생성 (멘티 요청)

- **Endpoint:** `POST /coffeechats`
- **Authentication:** `JWT Required`
- **Request Body**

```json
{
  "timeSlotId": 45
}
```

- **Response** (`201 Created`)

```json
{
  "id": 1,
  "mentorId": 2,
  "menteeId": 1,
  "timeSlotId": 45,
  "status": "PENDING",
  "createdAt": "2026-05-18T13:10:49.000Z"
}
```

### 3.2 커피챗 승인 (멘토)

- **Endpoint:** `PATCH /coffeechats/:id/approve`
- **Authentication:** `JWT Required`
- **Path Parameters:**
  - `id` (number) — 커피챗 ID
- **Response** (`200 OK`)

```json
{
  "id": 1,
  "mentorId": 2,
  "menteeId": 1,
  "timeSlotId": 45,
  "status": "APPROVED",
  "createdAt": "2026-05-18T13:10:49.000Z"
}
```

### 3.3 커피챗 거절 (멘토)

- **Endpoint:** `PATCH /coffeechats/:id/reject`
- **Authentication:** `JWT Required`
- **Path Parameters:**
  - `id` (number) — 커피챗 ID
- **Response** (`200 OK`)

```json
{
  "id": 1,
  "mentorId": 2,
  "menteeId": 1,
  "timeSlotId": 45,
  "status": "REJECTED",
  "createdAt": "2026-05-18T13:10:49.000Z"
}
```

### 3.4 멘토 기준 커피챗 목록 조회

- **Endpoint:** `GET /coffeechats/mentor`
- **Authentication:** `JWT Required` (내부적으로 토큰의 user.sub를 mentorId로 사용)
- **Response** (`200 OK`)

```json
[
  {
    "id": 1,
    "mentorId": 2,
    "menteeId": 1,
    "timeSlotId": 45,
    "status": "PENDING",
    "createdAt": "2026-05-18T13:10:49.000Z",
    "chat": null,
    "mentee": {
      "id": 1,
      "name": "홍길동",
      "email": "mentee@example.com"
    },
    "mentor": {
      "id": 2,
      "name": "김멘토",
      "email": "mentor@example.com"
    },
    "timeSlot": {
      "id": 45,
      "startTime": "2026-05-20T14:00:00.000Z",
      "isReserved": true
    }
  }
]
```

### 3.5 멘티 기준 커피챗 목록 조회

- **Endpoint:** `GET /coffeechats/mentee`
- **Authentication:** `JWT Required` (내부적으로 토큰의 user.sub를 menteeId로 사용)
- **Response** (`200 OK`)

```json
[
  {
    "id": 1,
    "mentorId": 2,
    "menteeId": 1,
    "timeSlotId": 45,
    "status": "PENDING",
    "createdAt": "2026-05-18T13:10:49.000Z",
    "chat": null,
    "mentee": {
      "id": 1,
      "name": "홍길동",
      "email": "mentee@example.com"
    },
    "mentor": {
      "id": 2,
      "name": "김멘토",
      "email": "mentor@example.com"
    },
    "timeSlot": {
      "id": 45,
      "startTime": "2026-05-20T14:00:00.000Z",
      "isReserved": true
    }
  }
]
```

------

## 4. Mentors API (`/mentors`)

### 4.1 전체 멘토 조회

- **Endpoint:** `GET /mentors`
- **Authentication:** None
- **Response** (`200 OK`)

```json
[
  {
    "id": 2,
    "name": "김멘토",
    "email": "mentor@example.com",
    "headline": "5년차 풀스택 개발자입니다.",
    "bio": "네이버와 카카오를 거쳐 현재는 스타트업에서 CTO로 일하고 있습니다.",
    "techStack": ["NestJS", "TypeScript", "React", "Next.js"],
    "createdAt": "2026-01-15T08:00:00.000Z"
  }
]
```

### 4.2 멘토 단건 조회

- **Endpoint:** `GET /mentors/:id`
- **Authentication:** None
- **Path Parameters:**
  - `id` (number)
- **Response** (`200 OK`)

```json
{
  "id": 2,
  "name": "김멘토",
  "email": "mentor@example.com",
  "headline": "5년차 풀스택 개발자입니다.",
  "bio": "네이버와 카카오를 거쳐 현재는 스타트업에서 CTO로 일하고 있습니다.",
  "techStack": ["NestJS", "TypeScript", "React", "Next.js"],
  "createdAt": "2026-01-15T08:00:00.000Z"
}
```

------

## 5. Time Slots API (`/time-slots`)

### 5.1 타임슬롯 생성 (멘토)

- **Endpoint:** `POST /time-slots`
- **Authentication:** `JWT Required` (내부적으로 토큰의 user.sub를 mentorId로 사용)
- **Request Body**

```json
{
  "startTime": "2026-05-20T14:00:00.000Z"
}
```

- **Response** (`201 Created`)

```json
{
  "id": 45,
  "mentorId": 2,
  "startTime": "2026-05-20T14:00:00.000Z",
  "isReserved": false,
  "createdAt": "2026-05-18T13:10:49.000Z"
}
```

### 5.2 특정 멘토 슬롯 조회

- **Endpoint:** `GET /time-slots/:mentorId`
- **Authentication:** None
- **Path Parameters:**
  - `mentorId` (number)
- **Response** (`200 OK`)

```json
[
  {
    "id": 45,
    "mentorId": 2,
    "startTime": "2026-05-20T14:00:00.000Z",
    "isReserved": false,
    "createdAt": "2026-05-18T13:10:49.000Z"
  }
]
```

------

# API 권한 매트릭스 (Authorization Matrix)

프로세스 오동작을 방지하기 위해 각 API 엔드포인트별 접근 권한을 아래와 같이 제한합니다.

| **도메인**      | **기능명**          | **엔드포인트**                   | **JWT 인증 여부** | **주요 허용 대상**                  |
| --------------- | ------------------- | -------------------------------- | ----------------- | ----------------------------------- |
| **Auth**        | 회원가입            | `POST /auth/signup`              | ❌                 | 모든 사용자                         |
|                 | 로그인              | `POST /auth/login`               | ❌                 | 모든 사용자                         |
|                 | 내 정보 조회        | `GET /auth/me`                   | ⭕                 | 로그인한 모든 유저                  |
| **Mentors**     | 전체 멘토 조회      | `GET /mentors`                   | ❌                 | 모든 사용자                         |
|                 | 멘토 단건 조회      | `GET /mentors/:id`               | ❌                 | 모든 사용자                         |
| **Time Slots**  | 타임슬롯 생성       | `POST /time-slots`               | ⭕                 | **멘토(MENTOR)** 권한 권장          |
|                 | 특정 멘토 슬롯 조회 | `GET /time-slots/:mentorId`      | ❌                 | 모든 사용자                         |
| **CoffeeChats** | 커피챗 생성 (요청)  | `POST /coffeechats`              | ⭕                 | **멘티(MENTEE)** 권한 권장          |
|                 | 커피챗 승인         | `PATCH /coffeechats/:id/approve` | ⭕                 | **멘토(MENTOR)** (해당 예약 대상자) |
|                 | 커피챗 거절         | `PATCH /coffeechats/:id/reject`  | ⭕                 | **멘토(MENTOR)** (해당 예약 대상자) |
|                 | 멘토 기준 목록 조회 | `GET /coffeechats/mentor`        | ⭕                 | **멘토(MENTOR)**                    |
|                 | 멘티 기준 목록 조회 | `GET /coffeechats/mentee`        | ⭕                 | **멘티(MENTEE)**                    |
| **Chat**        | 채팅방 목록 조회    | `GET /chat`                      | ⭕                 | 로그인한 모든 유저                  |
|                 | 메시지 내역 조회    | `GET /chat/:roomId/messages`     | ⭕                 | 해당 채팅방 참여자                  |