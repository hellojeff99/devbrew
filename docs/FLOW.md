# 🚀 서비스 비즈니스 흐름 (flow.md)

본 문서는 API 명세서를 기반으로 한 멘토링 및 커피챗 서비스의 주요 비즈니스 흐름과 사용자 시나리오를 정의합니다.

------

## 1. 인증 및 사용자 관리 흐름 (Auth Flow)

모든 사용자는 서비스를 이용하기 위해 회원가입 및 로그인 과정을 거치며, 이후 권한이 필요한 API 요청 시 발급된 JWT(AccessToken)를 사용합니다.

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 (멘토/멘티)
    participant Auth as 인증 서버 (/auth)
    
    %% 회원가입
    Note over User, Auth: [회원가입 프리flow]
    User->>Auth: POST /auth/signup (이메일, 비밀번호, 이름, 역할[MENTOR/MENTEE])
    Auth-->>User: 201 Created (회원가입 완료)
    
    %% 로그인
    Note over User, Auth: [로그인 및 토큰 발급]
    User->>Auth: POST /auth/login (이메일, 비밀번호)
    Auth-->>User: 200 OK (accessToken, 유저 정보 반환)
    
    %% 내 정보 조회 (인증 확인)
    Note over User, Auth: [인가 및 토큰 검증]
    User->>Auth: GET /auth/me (Headers: Authorization Bearer)
    Auth-->>User: 200 OK (유저 sub, 역할 반환)
```

------

## 2. 핵심 비즈니스 플로우: 커피챗 및 채팅 (Core Service Flow)

서비스의 핵심은 **[멘토의 타임슬롯 생성] ➡️ [멘티의 커피챗 신청] ➡️ [멘토의 승인/거절] ➡️ [채팅방 활성화 및 소통]** 단계로 이어집니다.

### 2.1 전체 프로세스 요약 다이어그램

```mermaid
graph TD
    A[멘토: 로그인] --> B[멘토: 타임슬롯 생성 /time-slots]
    C[멘티: 로그인] --> D[멘티: 전체 멘토 및 슬롯 조회 /mentors, /time-slots/:id]
    B --> E[커피챗 예약 가능 상태]
    D --> E
    E --> F[멘티: 커피챗 신청 POST /coffeechats]
    F --> G{멘토의 선택 PATCH /coffeechats/:id/...}
    G -- 승인 APPROVE --> H[커피챗 확정 & 채팅방 목록 활성화 /chat]
    G -- 거절 REJECT --> I[커피챗 종료 PENDING -> REJECTED]
    H --> J[멘토/멘티: 채팅 메시지 조회 및 소통 GET /chat/:roomId/messages]
```

### 2.2 상세 시나리오별 시퀀스 다이어그램

```mermaid
sequenceDiagram
    autonumber
    actor Mentee as 멘티 (MENTEE)
    actor Mentor as 멘토 (MENTOR)
    participant TS as 타임슬롯 API (/time-slots)
    participant CC as 커피챗 API (/coffeechats)
    participant Chat as 채팅 API (/chat)

    %% 1. 멘토의 일정 등록
    Note over Mentor, TS: 1. 멘토 일정 등록
    Mentor->>TS: POST /time-slots (startTime 등록, JWT 필수)
    TS-->>Mentor: 201 Created (isReserved: false)

    %% 2. 멘티의 탐색 및 신청
    Note over Mentee, TS: 2. 멘티의 멘토 및 일정 탐색
    Mentee->>TS: GET /time-slots/:mentorId (인증 불필요)
    TS-->>Mentee: 200 OK (등록된 슬롯 목록 반환)
    
    Note over Mentee, CC: 3. 커피챗 신청
    Mentee->>CC: POST /coffeechats (timeSlotId, JWT 필수)
    CC-->>Mentee: 201 Created (Status: PENDING)

    %% 3. 멘토의 커피챗 관리
    Note over Mentor, CC: 4. 멘토의 신청서 확인 및 결정
    Mentor->>CC: GET /coffeechats/mentor (나에게 들어온 신청 목록 조회)
    CC-->>Mentor: 200 OK (PENDING 상태의 신청 확인)
    
    alt 승인하는 경우 (APPROVE)
        Mentor->>CC: PATCH /coffeechats/:id/approve (JWT 필수)
        CC-->>Mentor: 200 OK (Status: APPROVED)
        Note over Mentee, Mentor: 커피챗 확정 및 대화 가능 상태 전환
    else 거절하는 경우 (REJECT)
        Mentor->>CC: PATCH /coffeechats/:id/reject (JWT 필수)
        CC-->>Mentor: 200 OK (Status: REJECTED)
        Note over Mentee, Mentor: 프로세스 종료
    end

    %% 4. 채팅을 통한 소통
    Note over Mentee, Chat: 5. 상호 채팅 소통 (승인 시)
    Mentee->>Chat: GET /chat (채팅방 목록 조회)
    Chat-->>Mentee: 200 OK (최근 메시지 및 김멘토 방 확인)
    
    Mentee->>Chat: GET /chat/:roomId/messages (특정 방 대화 내역 조회)
    Chat-->>Mentee: 200 OK (기존 대화 내용 로드)
```

------