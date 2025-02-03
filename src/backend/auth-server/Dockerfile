FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD ["pnpm", "start:dev" "user"]
