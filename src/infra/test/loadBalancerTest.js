const WebSocket = require('ws');

// 테스트 설정
const SERVER_URL = 'http://localhost:8000/api/chat'; // WebSocket 서버 주소
const CONNECTION_COUNT = 50; // 연결할 클라이언트 수
const MESSAGE_TO_SEND = "Hello from client"; // 서버로 보낼 메시지
const connections = [];
const responses = {};

let openCount = 0;
let closeCount = 0;

// 연결 생성 및 테스트 시작
console.log(`Creating ${CONNECTION_COUNT} connections to ${SERVER_URL}...`);

for (let i = 0; i < CONNECTION_COUNT; i++) {
	const ws = new WebSocket(SERVER_URL);

	ws.on('open', () => {
		openCount++;
		console.log(`Connection ${i + 1} opened`);
		// 메시지 전송
		ws.send(MESSAGE_TO_SEND);
	});

	ws.on('message', (message) => {
		// 서버 응답 처리
		const parsedMessage = message.toString();
		console.log(`Connection ${i + 1} received: ${parsedMessage}`);

		// Target 서버 주소 기록
		if (!responses[parsedMessage]) {
			responses[parsedMessage] = 0;
		}
		responses[parsedMessage]++;
	});

	ws.on('close', () => {
		closeCount++;
		console.log(`Connection ${i + 1} closed`);
	});

	ws.on('error', (error) => {
		console.error(`Connection ${i + 1} error:`, error.message);
	});

	connections.push(ws);
}

// 결과 출력 및 종료
setTimeout(() => {
	console.log("\n--- Test Complete ---");
	console.log(`Open Connections: ${openCount}`);
	console.log(`Closed Connections: ${closeCount}`);
	console.log("Response Distribution:");
	console.log(responses);

	// 모든 연결 닫기
	connections.forEach((ws) => ws.close());
}, 10000); // 10초 동안 실행
