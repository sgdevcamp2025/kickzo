# kickzo 개발 문서

## 서버 띄우기

도커를 통해 서버를 띄우는 간단한 사용방법을 소개합니다. 자세한 내용은 `infra/README.md` 를 참고해주세요.

- 먼저, `도커 데스크톱`을 실행해주세요.
- 터미널을 열고 프로젝트의 `src` 디렉토리로 이동해주세요.
- 다음 명령어를 실행해주세요.

```bash
make up
```

**_끝~! 🎉_**

### Make 명령어 종류

`make help` 명령어로 makefile 명령어를 확인할 수 있습니다.

```bash
make help
```

```plaintext
make up - 컨테이너를 백그라운드에서 실행
make down - 모든 컨테이너 중지 및 네트워크 제거
make restart - 컨테이너를 재시작
make logs - 컨테이너 로그 표시
make build - 이미지를 다시 빌드
make exec - 특정 컨테이너 내부에 bash로 접속
make ps - 실행 중인 컨테이너 목록 확인
make clean - 모든 컨테이너, 네트워크 및 볼륨 제거
make fclean - 캐싱된 이미지, 볼륨, 네트워크 모두 제거
make help - 사용 가능한 명령어 표시
```

## 마무리

사용 방법이 어려우시다면, 언제든지 질문해주세요! 🙋‍♂️(inho)
