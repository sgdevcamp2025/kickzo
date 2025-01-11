// ws-server.js
const WebSocket = require("ws");

const PORT = process.env.CHAT_PORT || 3001;

// WebSocket 서버 생성
const wss = new WebSocket.Server({ port: PORT }, () => {
	console.log(`WebSocket Server is running on ws://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
	console.log("New WebSocket connection");

	// 클라이언트로부터 메시지 수신
	ws.on("message", (message) => {
		console.log(`Received: ${message}`); // 수신한 메시지 출력

		// 연결된 모든 클라이언트에 메시지 브로드캐스트
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message.toString()); // 수신한 메시지를 클라이언트에 전송
			}
		});
	});

	// 클라이언트 연결 종료 처리
	ws.on("close", () => {
		console.log("WebSocket connection closed");
	});
});
