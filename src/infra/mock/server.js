const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
	logger: true // 로깅 활성화
});

// 미들웨어 적용
server.use(middlewares);

// JSON 데이터 파싱을 위한 미들웨어(POST, PUT, PATCH 요청 처리)
server.use(jsonServer.bodyParser);

// 동시 요청 직렬화 로직
let isWriting = false;

// 요청을 처리하기 전에 동시 쓰기를 방지하는 미들웨어
server.use((req, res, next) => {
	if (isWriting) {
		res.status(503).send({ message: 'Server is busy, try again later' });
	} else {
		isWriting = true;
		res.on('finish', () => {
			isWriting = false;
		});
		next(); // 다음 미들웨어로 이동
	}
});

// JSON Server 라우터 사용
server.use(router);

// 서버 실행
const PORT = process.env.MOCK_PORT || 3999;
server.listen(PORT, () => {
	console.log(`JSON Server is running on port ${PORT}`);
});
