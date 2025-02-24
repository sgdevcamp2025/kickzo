# KickTube Frontend

KickTube는 실시간 유튜브 영상 공유 및 채팅 플랫폼입니다.

## 기술 스택

### Core

- React 18.3
- TypeScript 5.6
- Vite 6.0

### 상태 관리

- Zustand 5.0 (전역 상태 관리)
- TanStack Query 5.64 (서버 상태 관리)

### 스타일링

- Styled Components 6.1
- CSS Variables (Design Tokens)

### 라우팅

- React Router 7.1

### 실시간 통신

- SockJS 1.5
- StompJS 2.3

### 개발 도구

- ESLint 9.18
- Prettier 3.4
- Storybook 8.4
- Vitest 2.1 (테스트)
- Sentry 8.48

## 환경 변수

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

- `VITE_API_URL`: 백엔드 API 엔드포인트
- `VITE_WEBSOCKET_URL`: 웹소켓 엔드포인트
- `VITE_YOUTUBE_API_KEY`: 유튜브 API 키
- `VITE_SENTRY_DSN`: Sentry DSN
- `VITE_SENTRY_AUTH_TOKEN`: Sentry 인증 토큰
- `VITE_IS_PROD`: 프로덕션 환경 여부
이러한 환경 변수는 프로젝트 루트에 `.env` 파일을 생성하여 설정할 수 있습니다.

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev

# 빌드
pnpm run build

# 프로덕션 서버 실행
pnpm run storybook
```

## 프로젝트 구조


### 주요 기능

- **실시간 채팅**: WebSocket과 Stomp 프로토콜을 통한 실시간 채팅 기능
- **유튜브 영상 공유**: 실시간 유튜브 영상 공유 및 동기화
- **방 관리**: 공개/비공개 방 생성 및 관리
- **사용자 관리**: 프로필 관리 및 친구 시스템
- **검색**: Elasticsearch를 통한 유저, 방 검색 기능

### 상태 관리

- `useAuthStore`: 엑세스 토큰 및 리프레시 토큰 관리
- `useUserStore`: 사용자 정보 관리
- `useMyRoomsStore`: 사용자의 방 목록 관리
- `useCurrentRoomStore`: 현재 접속한 방 정보 관리
- `useWebSocketStore`: 웹소켓 연결 및 실시간 통신 관리
- `useVideoStore`: 유튜브 영상 관리


### 스타일 가이드

- CSS Variables를 통한 디자인 토큰 관리
- Styled Components를 활용한 컴포넌트 스타일링
