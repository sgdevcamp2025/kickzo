# Node.js 베이스 이미지
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 환경변수 전달을 위한 ARG 설정
ARG CHAT_PORT=3001
ENV CHAT_PORT=$CHAT_PORT

# 런타임에서 환경변수로 설정된 포트를 노출
EXPOSE $CHAT_PORT

# WebSocket 서버 실행
CMD ["npm", "start"]
