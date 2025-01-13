# Kong Gateway 설정

이 문서는 **Kong Gateway**를 사용하여 서비스와 라우트를 설정하는 방법을 설명합니다.

본 설정은 **DB-less** 모드에서 작동하며, 모든 설정은 `kong.yml` 파일을 통해 관리됩니다.

---

## 설정 개요

- **서비스 (Services)**: Kong이 요청을 프록시할 백엔드 서비스.
- **라우트 (Routes)**: 요청 경로와 이를 처리할 서비스 간의 매핑.(각 서비스간에 고유한 값)

---

## endpoints 요약

- **Chat URL**: `http://localhost:8000/api/chat`
- **Mock URL**: `http://localhost:8000/mock`

## kong.yml 구조

### 포맷 버전

- `_format_version: "3.0"`: YAML 파일의 포맷 버전

### 서비스와 라우트

#### Chat 서비스

- **이름**: `chat-service`
- **백엔드 URL**: `http://chat-service:3001`
  - Kong은 `chat-service`라는 Docker 컨테이너 이름으로 백엔드에 접근합니다.
- **라우트**:
  - **이름**: `chat-route`
  - **경로**: `/api/chat`
    - `/api/chat`으로 시작하는 모든 요청은 `chat-service`로 프록시됩니다.

#### Mock 서비스

- **이름**: `mock-service`
- **백엔드 URL**: `http://mock-server:3999`
  - Kong은 `mock-server`라는 Docker 컨테이너 이름으로 백엔드에 접근합니다.
- **라우트**:
  - **이름**: `mock-route`
  - **경로**: `/mock`
    - `/mock`으로 시작하는 모든 요청은 `mock-service`로 프록시됩니다.

---

## HTTP 및 Admin API 설명

### HTTP 기본 포트

- **프록시 포트**:
  - **8000**: HTTP 요청 수신.
  - **8443**: HTTPS 요청 수신 (SSL 적용 안해서 지금은 사용 못합니다).
- 클라이언트는 Kong Gateway를 통해 HTTP/HTTPS 요청을 보낼 수 있습니다.

### Admin API 포트

- Admin API는 Kong의 설정 및 상태를 관리하기 위한 RESTful API입니다.
- **기본 포트**:
  - **8001**: HTTP로 Admin API에 접근.
  - **8444**: HTTPS로 Admin API에 접근.
- **Admin API 종류**
  - /services
  - /routes
  - /plugins
  - /status

(2025.1.12 작성 by inshin)
