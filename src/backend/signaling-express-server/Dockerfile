# Node.js 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 서버 실행
CMD ["node", "server.js"]

# 컨테이너가 실행될 포트
EXPOSE 8105