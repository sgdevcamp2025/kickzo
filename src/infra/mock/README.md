# JSON Server

json-server는 JSON 파일을 사용하여 가짜 REST API를 생성하는 도구입니다. 프론트엔드에서 백엔드 API를 호출하기 전에 Mocking API를 사용하여 개발을 진행할 수 있습니다.

## 요약

- Kong Gateway를 켜둔 경우, Mock API는 Kong Gateway를 통해 호출할 수 있습니다.

## 사용 방법

makefile을 사용하여 mock 서버를 실행합니다.

```bash
# makefile 경로에서 실행
make mock
```

- **Mock URL**: `http://localhost:8000/mock`(kong gateway 사용 시)
- 실제 URL은 `http://localhost:3999`입니다.

해당 url로 요청을 보내면 `db.json` 파일에 정의된 데이터를 반환합니다.

## 확인 방법

curl을 사용하여 Mock API를 호출할 수 있습니다.

```bash
curl http://localhost:8000/mock/posts
```

## 추가 정보

- `db.json` 파일을 수정하여 원하는 데이터 구조로 Mock API를 변경할 수 있습니다.

## 에러 해결

### JSON Server의 데이터 저장 문제

- **요약**:
  **db.json 데이터 저장 문제**로 json-server를 바로 사용하지 않고 server.js를 사용하여 실행하고 있습니다.

- **문제**: POST 요청으로 데이터를 추가하면 정상적으로 데이터가 추가되었지만, 간헐적으로 500 Internal Server Error 발생.

```bash
[Error: EBUSY: resource busy or locked, rename '.db.json.tmp' -> 'db.json']
```

- **원인**:
  - json-server는 데이터를 디스크에 저장하는 과정에서 동시 쓰기로 인해 파일 잠금 문제(file lock)가 발생함.
  - Docker 환경에서 여러 요청이 동시에 들어올 경우 이 문제가 더 빈번히 발생.
- **해결**:
  - server.js로 json-server를 실행하고, 동시 쓰기 방지 로직을 추가하여 문제를 해결.

## 마무리

사용 방법에 대해서 어려움이 있으시면 언제든지 문의해주세요.(inho🕺)

(25.1.12 작성)
