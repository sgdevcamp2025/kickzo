# Chat Service 문서

## Chat Service 테스트

다음 명령어를 실행하여 wscat을 설치합니다.

```bash
npm install -g wscat
```

wscat를 사용하여 WebSocket API에 연결하고 메시지 보내기

```bash
wscat -c ws://localhost:3001
```

Kong gateway를 사용하는 경우

```bash
wscat -c ws://localhost:8000/api/chat
```

(25.1.13 작성 by.inho)
