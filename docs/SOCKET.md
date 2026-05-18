# DevBrew MVP - Socket.IO Architecture

## 1. 개요 및 인증 (Overview & Auth)

- **목적**: Socket.IO 기반 저지연 1:1 양방향 채팅 (Room 단위 격리)
- **프로토콜**: WebSocket 권장
- **인증**: 최초 핸드셰이크 시 `auth` 객체로 JWT 전달 \rightarrow 검증 실패 시 연결 거부, 성공 시 소켓에 `userId` 바인딩

```js
// 클라이언트 연결 예시
const socket = io("https://api.devbrew.com", {
  auth: { token: "Bearer YOUR_JWT_ACCESS_TOKEN" }
});
```

------

## 2. 핵심 아키텍처 규칙 (Core Rules)

1. **선 저장 후 방송**: 모든 메시지는 DB 영속화 성공 후 룸에 브로드캐스트합니다.
2. **권한 검증 필수**: 룸 진입(`join_room`) 및 메시지 전송(`send_message`) 시, 해당 룸에 대한 유저의 접근 권한을 매번 검증합니다.
3. **예외 처리**: 권한 없는 요청은 즉시 `error` 이벤트를 발생시키고 차단합니다.

------

## 3. 이벤트 정의 (Events)

### [Client → Server]

- **`join_room`**: 채팅방 진입 시 요청  JSON

  ```
  { "roomId": "string (UUID)" }
  ```

  - *서버 동작*: 권한 검증 \rightarrow 통과 시 Socket.IO 룸 채널 조인 (실패 시 `error`)

- **`send_message`**: 메시지 발신 시 요청

JSON

```json
  {
    "roomId": "string (UUID)",
    "message": "string"
  }
```

- *서버 동작*: 발신자 권한 검증 \rightarrow DB 저장 \rightarrow 룸 전체에 `receive_message` 브로드캐스트

------

### [Server → Client]

- **`receive_message`**: 룸 내 참여자들에게 메시지 전달 (발신자 포함)

```json
  {
    "messageId": "string (UUID)",
    "roomId": "string (UUID)",
    "senderId": "string (UUID)",
    "message": "string",
    "createdAt": "string (ISO 8601 UTC)"
  }
```

- **`error`**: 규칙 위반 및 에러 발생 시 전송

```json
  {
    "code": "UNAUTHORIZED | DB_ERROR | etc",
    "message": "string"
  }
```

------

## 4. 클라이언트 핵심 라이프사이클 (Client Flow)

1. **초기화**: 앱 구동 또는 로그인 완료 시 소켓 인스턴스를 **싱글톤**으로 생성 및 유지합니다.
2. **진입 (Setup)**: 채팅방 진입 시 `join_room`을 호출하고, `receive_message` 및 `error` 리스너를 등록합니다.
3. **송수신 (Chatting)**: 메시지 전송 시 `send_message`를 발생시키고, 수신 대기 중인 리스너를 통해 UI 상태를 업데이트합니다.
4. **정리 (Cleanup)**: 화면 이탈(언마운트) 시 등록된 이벤트 리스너(`.off()`)를 반드시 해제하여 메모리 누수를 방지합니다.