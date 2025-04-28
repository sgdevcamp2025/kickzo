# 🎬 KickTube - Main Server

KickTube는 여러 사용자가 실시간으로 유튜브 영상을 함께 시청하고, 채팅하며, 재생목록을 공유할 수 있는 **커뮤니티 기반 동기화 스트리밍 서비스**입니다.  
그중 **Main Server**는 전체 시스템의 중심으로서, 방(Room), 사용자(User), 재생목록(Playlist)과 같은 핵심 데이터를 관리하며, 타 서비스(Chat/Signaling 등)와의 연계를 위한 기반을 제공합니다.

---

## 📌 서비스 성격

KickTube는 단순한 실시간 스트리밍 서비스가 아닙니다.  
**입장과 퇴장이 자유로운 일회성 방 개념이 아닌**,  
**디스코드(Discord)처럼 커뮤니티 기반으로 설계된 지속 가능한 채널 중심의 서비스**입니다.

- 방은 단순 영상 공유 공간이 아닌, **채팅, 유저 상태, 재생목록이 지속적으로 관리되는 커뮤니티**입니다.
- 이러한 특성상 **유저 상태 관리, 초대 기반 접근 제어, 실시간 방 동기화** 등의 기능이 포함됩니다.

> 💡 일반적인 아프리카TV나 유튜브 라이브처럼 휘발성 구조가 아니라,  
> **참여자 중심의 상호작용과 지속적인 커뮤니케이션을 전제로 설계된 서비스**입니다.

---

## 🧩 역할

- **방(Room) 관리**
  - 방 생성, 삭제, 공개 여부 설정 기능 제공
  - 전체 공개 방 목록 조회 및 **방 제목 기반의 검색 기능** 지원


- **방 초대 기능 (Redis 기반)**
  - **비공개 방**의 경우, 초대 코드를 통한 제한적 입장 구조 설계
  - 초대 정보는 Redis에 저장되며, TTL 설정(7일)로 자동 만료 처리
  - 초대 상태(`PENDING`, `ACCEPTED`, `REJECTED`) 기반 제어


- **유저(RoomUser) 관리**
  - 유저의 방 입장 및 퇴장 처리 API 제공
  - **실시간 유저 상태 관리**
    - WebSocket 연결 및 API를 통해 Redis에 접속 상태 갱신
    - 퇴장 또는 연결 종료 시 Redis에서 유저 정보 제거


- **재생목록(Playlist) 관리**
  - 유튜브 URL 기반 영상 추가, 삭제, 순서 조정 기능 제공
  - 재생목록 변경 시 Kafka를 통해 실시간 동기화 지원


- **Kafka 기반 이벤트 설계**
  - Chat Server 등 마이크로서비스와의 통신을 위한 Kafka 이벤트 발행 구조 설계
  - `user-join`, `user-out`, `playlist-update`, `invitation` 등 다양한 이벤트를 주제로 구성

---

## ⚙️ 기술 스택

| 구성 요소 | 기술                     |
|-----------|------------------------|
| 언어 | Java 21                |
| 프레임워크 | Spring Boot 3.4.1      |
| 데이터베이스 | MySQL 8.0              |
| ORM | Spring Data JPA        |
| 메시징 | Apache Kafka           |
| 캐시/초대 코드 저장 | Redis                  |
| 환경 구성 | Docker, Docker Compose |
| 빌드 툴 | Gradle                 |

---

## 🏗 아키텍처

### 시스템 구성도

<img alt="최종메인" src="https://github.com/user-attachments/assets/38da37e2-a62e-48b2-b88f-96236a6d976d" width="700"/>

---
## 🛠 구현

### 1. 실시간 유저 상태 관리 (WebSocket + Redis + Kafka)
  관련 pr: [[BE] FEAT: 메인 서버 - 방 마다 실시간 접속자 관리 #237](https://github.com/sgdevcamp2025/kickzo/pull/244)
- **구현 구조 및 흐름**
  1. **유저 입장 시 Redis에 상태 저장**
     - 메인 서버에서 `joinRoom` API 호출 시, Redis 5번 DB에 다음과 같이 유저 상태를 저장
       ```
       Key: room:{roomId}:users
       Value: Set of userId
       ```
  2. **Kafka를 통한 user-join 이벤트 전파**
     - 유저가 입장하면 Kafka의 `room` 토픽(room-events)에 `"user-join"` 이벤트를 Publish
     - 포함 정보: `roomId`, `UserInfoDto`
     - 채팅 서버(Chat Server)는 이 이벤트를 수신하여 WebSocket을 통해 해당 방 클라이언트에게 유저 정보 전송

  3. **클라이언트가 퇴장 시 WebSocket → Kafka로 user-out 전송**
     - 클라이언트가 방에서 나갈 경우, WebSocket 메시지(`/app/user-out`)를 Chat Server에 전송
     - Chat Server는 이를 Kafka의 `"user-out"` 이벤트로 전환하여 Publish

  4. **Kafka user-out 이벤트 처리 흐름**
     - **Chat Server**: Kafka의 `"user-out"` 이벤트를 수신하여 WebSocket으로 나머지 유저들에게 실시간 전송
     - **Main Server**: Kafka `"user-out"` 이벤트 수신 시, Redis에서 해당 유저 삭제  
       → `room:{roomId}:users`에서 `userId` 제거


 - **주요 코드**
    ```java
    // 입장 시 Redis에 유저 저장 (RoomService.java)
    userEnterRedisRepository.addUserToRoom(roomId, userId);
    
    // Kafka를 통해 user-join 이벤트 전송 (RoomService.java)
    kafkaProducerService.sendRoomUserInfo(roomId, new UserInfoDto(...));
    
    // 퇴장 시 KafkaConsumer에서 user-out 이벤트 수신 처리 (KafkaConsumerService.java)
    userOutRedisRepository.removeUserFromRoom(roomId, userId);
    ```

<br>

### 2. 방 초대 시스템 (Redis + Kafka)
관련 pr: [[BE] FEAT: 메인 서버 - 초대 기능 추가 #162](https://github.com/sgdevcamp2025/kickzo/pull/162)

- **구현 구조**
  - 방 초대 요청 시 `InvitationData`를 Redis에 저장하고 TTL(Time To Live)을 7일로 설정
  - 초대 요청은 중복/거절 여부를 Redis에서 검증
  - 초대 수락/거절에 따라 상태를 업데이트하고, Kafka로 초대 관련 이벤트를 전파


- **핵심 흐름**
  1. 사용자가 초대 요청을 보냄
  2. `InvitationService`에서 Redis에 `room_request:{senderId}:{receiverId}:{roomId}` 형태로 저장
  3. Kafka `invitation` 토픽에 메시지를 전송하여 다른 서비스와 연동
  4. 수락/거절 시 Redis에 저장된 초대 상태(PENDING → ACCEPTED/REJECTED) 업데이트


- **에러 및 검증 처리**
  - 이미 방에 있는 유저 → `EXISTING_ROOM_USER`
  - 유효하지 않은 방 코드 → `INVALID_ROOM`
  - 중복 초대 → `DUPLICATE_INVITATION`

  
- **상태 기반 검증 정책**
  
  | 상태         | 초대 가능 | 수락 가능 | 거절 가능 |
  |--------------|------------|------------|-------------|
  | `PENDING`    | ❌         | ✅         | ✅          |
  | `ACCEPTED`   | ❌         | ❌         | ❌          |
  | `REJECTED`   | ❌         | ❌         | ❌          |
  
  - 중복 초대 방지: Redis에 저장된 초대 상태를 기준으로 필터링
  - 잘못된 요청 처리: 수락/거절 시 초대 상태에 따라 예외 발생


 - **주요 코드**
    ```java
    // Redis 저장
    redisTemplate.opsForValue().set(key, invitationData);
    redisTemplate.expire(key, Duration.ofDays(7));
    
    // Kafka 전송
    kafkaProducerService.sendRoomInvitation(objectMapper.writeValueAsString(invitationData));
    
    // 초대 수락
    invitationData.setStatus(InvitationStatus.ACCEPTED);
    saveInvitationData(key, invitationData);
    
    // 초대 거절
    invitationData.setStatus(InvitationStatus.REJECTED);
    saveInvitationData(key, invitationData);
    ```

<br>

###  3. 방/유저 검색 기능 (Elasticsearch + Scheduler)

- **구현 구조**
  - 추후 태그 기반 검색, 필터링 등 기능 확장 가능성을 염두에 둔 설계
  
  <br>
  
  - **방 검색(Room Search)**
    - 방 생성 시 공개 여부(`isPublic`)를 확인한 후 Elasticsearch에 색인
    - 메인서버에서 직접 검색 API 제공 (제목 기반 키워드 검색)
    - 비공개 방은 Elasticsearch에 저장하지 않음

  - **유저 검색(User Search)**
    - 유저 정보는 실시간이 아닌, **배치(Batch) 기반 스케줄러**로 5분마다 동기화
    - 마지막 동기화 시점 이후 수정된 유저만 필터링하여 Elasticsearch에 저장
    - 닉네임, 상태 메시지를 기준으로 검색 가능

  <br>

- **주요 코드**

  **SearchService.java**
  ```java
  // 공개 방만 Elasticsearch에 저장
  if (!room.getIsPublic()) return;

  roomSearchRepository.save(new RoomDocument(...));
  ```
  **유저 동기화 UserBatchService.java**
  ```java
  // 공개 방만 Elasticsearch에 저장
  @Scheduled(fixedRate = 300000) // 5분 간격
  public void syncUsersToElasticsearch() {
    ...
    List<User> updatedUsers = userRepository.findUpdatedUsers(lastSyncTime);
    searchService.bulkIndexUsers(updatedUsers);
    ...
  }
  ```
