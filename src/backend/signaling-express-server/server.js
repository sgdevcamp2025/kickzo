import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import Redis from "ioredis";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config({ path: ".env.docker" }); 
const app = express();
const PORT = 8105;
const REDIS_HOST = process.env.REDIS_HOST?.trim() || "redis";
const REDIS_PORT = process.env.REDIS_PORT?.trim() || 6379;
const REDIS_DB = process.env.REDIS_DB?.trim() || 4;


console.log("🔧 REDIS 연결 설정:", { REDIS_HOST, REDIS_PORT, REDIS_DB }); // ✅ 환경 변수 로그 출력

// Redis 클라이언트 설정
const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  db: REDIS_DB,
});

// CORS 미들웨어 설정 (클라이언트 URL에 맞게 조정)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://kicktube.site"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Express server with CORS enabled!");
});

// 특정 방의 유저 목록 조회 API
app.get("/api/signal/participants/:roomId", async (req, res) => {
  const { roomId } = req.params;
  console.log("API CALL")
  try {
    const users = await redisClient.smembers(`room:${roomId}`);
    res.json({ roomId, users });
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://kicktube.site"], // 클라이언트 주소
    methods: ["GET", "POST"],
    credentials: true,
  },
});

wsServer.on("connection", async (socket) => {
  console.log("✅ A client connected:", socket.id);

  socket.on("join_room", async ({ roomId, userId }) => {
    socket.join(roomId);
    // 방 이름을 socket 객체에 저장해두면 나중에 disconnect 시 사용할 수 있습니다.
    socket.roomId = roomId;
    socket.userId = userId;

    // 방에 속한 유저를 Redis에 추가
    await redisClient.sadd(`room:${roomId}`, userId);

    // 해당 방의 모든 사용자 목록을 새로고침하도록 emit
    const users = await redisClient.smembers(`room:${roomId}`);
    wsServer.to(roomId).emit("update_user_list", users);

    socket.to(roomId).emit("welcome", socket.id, userId);
  });

  // WebRTC offer
  socket.on("offer", (offer, remoteId) => {
    // remoteId에게 offer와 sender의 userId 전달
    wsServer.to(remoteId).emit("offer", offer, socket.id, socket.userId);
  });

  // WebRTC answer
  socket.on("answer", (answer, remoteId) => {
    wsServer.to(remoteId).emit("answer", answer, socket.id, socket.userId);
  });

  // ICE candidate
  socket.on("ice", (ice, remoteId) => {
    wsServer.to(remoteId).emit("ice", ice, socket.id, socket.userId);
  });
  
  socket.on("disconnect", async () => {
    console.log("❌ Client disconnected:", socket.id);
    // 사용자가 속한 방이 있다면 나간 사용자 정보를 방에  다른 클라이언트에 전달합니다.
    if (socket.roomId && socket.userId) {
      await redisClient.srem(`room:${socket.roomId}`, socket.userId);
      const users = await redisClient.smembers(`room:${socket.roomId}`);
      wsServer.to(socket.roomId).emit("update_user_list", users);
      socket.to(socket.roomId).emit("user_left", socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
