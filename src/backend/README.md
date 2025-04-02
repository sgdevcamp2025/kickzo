# Backend 문서

## ✨ 프로젝트 환경
- 인원: 5명 (iOS 1, FE 2, BE 2)
- 기간: 2025.01 ~ 2025.02 (2개월)
- 구성 방식: MSA(Microservice Architecture) + Docker 기반
- 백엔드 프레임워크: Spring Boot, NestJS, FastAPI

<br>

## 🧱 기술 스택

| 항목 | 사용 기술 |
|------|-----------|
| 언어 | Java (Spring Boot), TypeScript (NestJS), Python (FastAPI)|
| 프레임워크 | Spring Boot, NestJS, FastAPI |
| 메시지 브로커 | Apache Kafka |
| 데이터베이스 | MySQL, MongoDB, Redis |
| 파일 스토리지 | Amazon S3 |
| 모니터링 | Prometheus, Grafana, CloudWatch |
| 로그 수집 및 검색 | ELK Stack (Elasticsearch, Logstash, Kibana) |
| 배포 및 환경	 | Docker, Docker Compose, AWS EC2 |
| API Gateway | Kong Gateway |
| 실시간 통신 | WebSocket, STOMP, Kurento (미디어 서버), STUN/TURN |


<br>

## 🖼️ 시스템 아키텍처

![kickzo-최종전체1111 drawio](https://github.com/user-attachments/assets/d6722355-d605-43bd-9bd7-e5c3ba0aad76)

- **Client ↔ Kong Gateway**: 모든 요청은 Kong Gateway를 통해 라우팅
- **Kafka**: 서비스 간 비동기 이벤트 전달
- **Redis**: 인증, 초대, 친구 요청 등 빠른 읽기/쓰기 캐시 저장
- **MySQL**: 핵심 사용자 및 메인(방 정보) 데이터 저장
- **MongoDB**: 채팅 히스토리 저장
- **Amazon S3**: 파일 업로드 저장소
- **Kurento**: WebRTC 기반의 미디어 서버로, STUN/TURN 서버와 연동하여 음성/영상 통신 지원

<br>

## 📁 주요 기능

- ✅ **회원가입 / 로그인 / 토큰 재발급**: 인증 서버를 통한 JWT 기반 인증 처리  
- 👥 **친구 요청, 수락, 친구 목록 관리**: 친구 추가/삭제 및 상태 연동 기능  
- 💬 **실시간 채팅 (WebSocket + STOMP)**: 채팅 메시지 송수신
- 🎙️ **WebRTC 기반 음성 채팅 (Kurento, STUN/TURN)**: 방 내 사용자 간 음성 통화  
- 🏠 **방 생성 / 초대 / 퇴장 / 삭제 관리**: 방 단위 권한, 플레이리스트 관리 및 사용자 초대 기능
- 🎵 **영상 플레이리스트 실시간 동기화 및 관리 (WebSocket)**: 방 내 모든 유저가 동일한 재생목록을 공유하고 동기화
- 🔍 **채팅방 검색 / 유저 검색 기능**: 키워드 기반의 방/유저 탐색 기능  
- 📊 **상태 모니터링 및 로그 분석 (Prometheus, Grafana, ELK)**: 서비스 상태 시각화 및 로깅

<br>

## 👨‍👩‍👧‍👦 역할 분담

| 담당자 | 주요 담당 서버 및 기능 |
|----------|------------------------|
| **<a href="https://github.com/42inshin">신인호</a>** | 인증 서버, 유저 서버 |
| **<a href="https://github.com/dahyun24">우다현</a>** | 메인 서버, 소켓 서버, 검색 및 로그 수집 (ELK), WebRTC 시그널링 서버 |
| **<a href="https://github.com/yoo-chris">유성욱</a>** | 채팅 서버, 채팅 히스토리 서버, 상태 관리 서버, 친구 서버, 모니터링 (Prometheus, Grafana) |

