FROM node:20.11-alpine

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 락파일과 package.json 복사
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 5173

# 명시적인 host와 port 설정
CMD ["pnpm", "run", "dev:docker"]
