// chat-server.js
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';

// 1. 환경 변수 설정
const PORT = process.env.CHAT_PORT || 3001;
const CHANNEL_NAME = "global-chat";

// 2. Redis 클라이언트 생성(v4 이상 방식)
const pub = createClient({
	url: 'redis://redis-server:6379',  // docker-compose의 서비스 이름이 "redis-server"라면 이렇게
});
const sub = pub.duplicate(); // publish용 클라이언트를 복제하여 구독용으로 사용

// v3 이하 방식
// const sub = redis.createClient({
// 	host: "redis-server",
// 	port: 6379,
// });

// 3. 오류 핸들러
pub.on('error', (err) => console.error('Redis Pub Error:', err));
sub.on('error', (err) => console.error('Redis Sub Error:', err));

// 4. Redis 연결
await pub.connect();  // v4에서는 connect()를 명시적으로 호출해야 함!!
await sub.connect();

// 5. WebSocket 서버 생성
const wss = new WebSocketServer({ port: PORT }, () => {
	console.log(`WebSocket Server is running on ws://localhost:${PORT}`);
});

// 6. Redis 구독 (sub)
await sub.subscribe(CHANNEL_NAME, (message, channel) => {
	console.log(`[Redis] Message received on channel ${channel}: ${message}`);

	// Redis에서 받은 메시지를 모든 WebSocket 클라이언트에게 브로드캐스트
	wss.clients.forEach((client) => {
		if (client.readyState === 1) { // WebSocket.OPEN === 1
			client.send(message);
		}
	});
});

// WebSocket 클라이언트 연결 처리
wss.on("connection", (ws) => {
	console.log("New WebSocket connection");

	// 클라이언트로부터 메시지 수신
	ws.on("message", async (message) => {
		console.log(`[WebSocket] Received: ${message}`); // 수신한 메시지 출력
		// Redis에서 메시지 발행
		await pub.publish(CHANNEL_NAME, message);
	});

	// 클라이언트 연결 종료 처리
	ws.on("close", () => {
		console.log("WebSocket connection closed");
	});
});

// 프로세스 종료 시 Redis 연결 종료
process.on('SIGINT', async () => {
	console.log('Shutting down...');
	// 구독 해제 후
	await sub.unsubscribe(CHANNEL_NAME);
	// 연결 종료
	await pub.quit();
	await sub.quit();
	process.exit(0);
});
