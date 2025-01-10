# Resources

아키텍처 관련 사진 등 문서 외의 자료들을 모아두는 폴더입니다.

### 유의 사항

> Git Error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400 Bad Request 발생 시

Gitgub에 자료를 올릴 때 한번에 너무 많은 데이터를 올리려고 시도하면 위와 같은 에러가 날 수 있습니다.

아래의 명령어를 통해서 http.postBuffer를 늘려주면 해결됩니다.

```bash
git config --global http.postBuffer 524288000
```

명령어를 실행한 후 다시 push를 시도해보세요.
