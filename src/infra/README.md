# Infra 인프라

## Docker 사용법

Kickzo🕺 프로젝트에서 도커를 사용하는 방법에 대해 설명드리겠습니다.

도커가 처음이신 분들은 [도커 설치](https://docs.docker.com/get-docker/)를 먼저 진행해주세요.

각자의 OS에 맞게 설치 부탁드립니다.

### Docker란?

도커는 컨테이너 기반의 오픈소스 가상화 플랫폼입니다.

_무슨 말인지 모르겠다고요? 그럼 간단하게 설명드리겠습니다._

"VM(가상 머신)보다 가볍고, 빠르게 가상환경에 독립된 환경을 띄우는 멋진 도구"라고 생각하시면 됩니다.

### 독립된 환경을 띄우려면?

**도커는 서비스에 필요한 환경을 Dockerfile에 작성해 하나의 이미지를 생성하고 컨테이너를 띄우는 방식으로 동작합니다.**

- Dockerfile: 컨테이너 이미지를 빌드하기 위한 설정 파일.
- 이미지: Dockerfile을 기반으로 생성된 실행 가능한 환경의 템플릿.
- 컨테이너: 이미지를 실행하여 실제로 작동하는 애플리케이션 인스턴스.

_음... "도커파일, 이미지, 컨테이너"의 관계는 "요리 레시피, 밀키트, 만들어진 요리" 비슷하다고 생각하시면 됩니다._

### Dockerfile 작성법

```dockerfile
# 이미지를 받아올 베이스 이미지를 정의합니다.
FROM node:18

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# 패키지 파일을 복사합니다.
COPY package*.json ./

# 패키지를 설치합니다.
RUN npm install

# 소스코드를 복사합니다.
# [COPY . .]: 현재 디렉토리의 모든 파일을 복사합니다.
COPY . .

# 컨테이너를 실행할 명령어를 정의합니다.
CMD ["npm", "start"]
```

### .dockerignore

Dockerfile에서 이미지를 빌드할 때, 불필요한 파일을 제외할 수 있습니다. 컨테이너 이미지에 포함되지 않아야 할 파일을 **꼭 작성해주세요!**

```plaintext
node_modules
npm-debug.log
.DS_Store
... 등등
```

### 도커 명령어

#### 이미지 빌드

```bash
docker build -t kickzo .
# 도커 이미지생성 -t(태그명)  kickzo(이미지명) .(현재 디렉토리에 있는 Dockerfile을 사용)
```

현재 디렉토리(.)에 있는 Dockerfile을 사용해 kickzo라는 이름으로 이미지를 빌드합니다.

#### 컨테이너 실행

```bash
docker run -p 3000:3000 kickzo
# 도커 컨테이너 실행 -p(포트포워딩) 3000:3000(호스트포트:컨테이너포트) kickzo(이미지명)
```

kickzo 이미지를 사용해 컨테이너를 실행하고, 호스트의 3000번 포트와 컨테이너의 3000번 포트를 연결합니다.

#### 컨테이너 확인

```bash
docker ps
```

현재 실행 중인 컨테이너 목록을 확인합니다.

#### 컨테이너 중지

```bash
docker stop kickzo
```

kickzo 컨테이너를 중지합니다.

_이 명령어를 제대로 공부하고 싶다면 검색해주세요! 저희는 더 간단히 사용하는 방법을 소개드릴게요._

---

## Docker Compose

MSA 구조로 서버를 띄우려면, 각 서버마다 하나씩 컨테이너를 띄워야 합니다.

그렇다면 위의 명령어를 하나씩 입력해야 하는데, 그렇게 하실건가요? 그리고 각 서버마다 포트를 다르게 설정해야 하는데, 그것도 하나씩 입력하실건가요? 저는 그렇게 못합니다...

그래서 필요한게 바로 **Docker Compose**입니다.

## Docker Compose 란?

**Docker Compose는 여러 개의 컨테이너를 정의하고 실행할 수 있도록 하는 도구입니다.**

Docker Compose를 사용하면, 여러 개의 컨테이너를 한 번에 실행할 수 있습니다.

서비스, 네트워크, 볼륨 설정도 가능하죠.

### docker-compose.yml 작성법

```yaml
version: "3.8"

# 서비스 정의
services:
  chat-service: # 서비스 이름
    build: # 이미지 빌드
      context: ../backend/chat-service # Dockerfile 경로
    container_name: chat-service # 컨테이너 이름
    ports: # 포트 설정
      - "3000:3000" # 호스트 포트:컨테이너 포트
    environment: # 환경변수 설정
      - TEAM_NAME=Kickzo
    networks: # 네트워크 설정
      - kickzo-network # 네트워크 이름(아래에서 정의)
    volumes: # 볼륨 설정
      - ../backend/chat-service:/usr/src/app # 호스트 경로:컨테이너 경로(컨테이너 내부와 호스트 간 연결: 소스코드 변경 시 자동 반영)
      - /usr/src/app/node_modules # 컨테이너 내부 경로(해당 경로는 호스트와 연결되지 않음)

networks:
  kickzo-network: # 네트워크 이름
    driver: bridge # 네트워크 드라이버(birdge(기본값), host, none 등)
```

이런 방식으로 서비스들을 정의하고, `docker-compose up` 명령어로 한 번에 실행할 수 있습니다. _쉽죠?_

### docker-compose 명령어

#### 컨테이너 실행

```bash
docker-compose up -d
```

#### 컨테이너 종료

```bash
docker-compose down
```

_이 명령어를 제대로 공부하고 싶다면 검색해주세요! 저희는 더 간단히 사용하는 방법을 소개드릴게요._

명령어가 어렵진 않죠? 하지만 더 쉽게 사용할 수 있는 방법이 있습니다.

---

## ⭐️ Makefile ⭐️

Makefile은 프로그램을 빌드하고 실행하는 데 사용되는 스크립트 파일입니다.

**_우리는 이걸 이용해서 Docker Compose 명령어를 간단하게 사용할 수 있습니다!_**

### Makefile 사용 방법

src 경로에서 `make up` 명령어를 실행하면, 컨테이너가 백그라운드에서 실행됩니다.

컨테이너를 중지하려면 `make down` 명령어를 실행하면 됩니다.

### Makefile 명령어 종류

```md
make up - 컨테이너를 백그라운드에서 실행
make down - 모든 컨테이너 중지 및 네트워크 제거
make restart - 컨테이너를 재시작
make logs - 컨테이너 로그 표시
make build - 이미지를 다시 빌드
make exec - 특정 컨테이너 내부에 bash로 접속
make ps - 실행 중인 컨테이너 목록 확인
make clean - 모든 컨테이너, 네트워크 및 볼륨 제거
make fclean - 캐싱된 이미지, 볼륨, 네트워크 모두 제거
make help - 사용 가능한 명령어 표시
```

`make help` 명령어로 makefile 명령어를 확인할 수 있습니다.

```bash
make help
```

## 마무리

이렇게 Docker와 Docker Compose를 사용하는 방법에 대해 알아보았습니다.

**사용 방법에서 어려운 점이 있으시다면, 언제든지 질문해주세요!🙋‍♂️(inho)**

(2025. 01. 11 작성)
