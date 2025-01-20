# kickzo

## 🚀 kickzo 소개

**Kickzo**는 170cm 이상의 키가 큰 5명의 팀원으로 구성되어 있습니다.🕺

- **팀원**: 김수경(iOS), 김주원(FE), 신인호(FE), 우다현(BE), 유성욱(BE)

**Kickzo**의 Kick은 Kick-off에 영감을 받았으며, 프로젝트의 시작을 의미합니다.

**Kickzo**는 함께 프로젝트를 멋지게 시작하고, 성장하며, 성공하기를 바라는 의미를 담고 있습니다.

## Git & GitHub Convention

### 🤔 Issue

1. **이슈 제목 형식**

- 대괄호 `[]` 안에 키워드(FE, BE, iOS, INFRA, COMMON)를 적고, 내용을 작성합니다.
- **키워드**:
  - `FE`: 프론트엔드 관련 이슈
  - `BE`: 백엔드 관련 이슈
  - `iOS`: 모바일 관련 이슈
  - `INFRA`: 인프라 관련 이슈
  - `COMMON`: 공통/기타 이슈
- **Example**:
  - `[FE] FEAT: 메인 페이지 UI 추가`
  - `[BE] BUG:방 상태관리 트랜잭션 무결성 문제`
  - `[iOS] FIX: concurrency를 이용한 API 로직 수정`
  - `[INFRA] FIX: Kong Gateway yml 파일 수정`
  - `[COMMON] FIX: 토큰, 인증 관련 로직 수정`

2. **이슈 작성 규칙**

- 태스크를 가능한 한 세분화하여 생성합니다.
- 하나의 이슈에는 가능한 **5개의 커밋** 내외로 작업하도록 합니다.
- 이슈 내용은 **템플릿**을 사용합니다.

---

### 🌳 Branch

1. **브랜치명 작성 형식**

- `구분/기준브랜치/작업_키워드/#이슈번호`

2. **구분**

- `fe`: 프론트엔드 관련 작업
- `be`: 백엔드 관련 작업 (서버 이름 추가 가능, e.g., `be-auth`)
- `ios`: 모바일 관련 작업
- `infra`: 인프라 관련 작업
- `common`: 공통/기타 작업

3. **기준 브랜치**

- 브랜치 생성 시 기준이 되는 브랜치 (e.g., `main`, `dev`)

4. **작업 키워드**

- 작업 유형 및 간단한 설명을 포함합니다. (e.g., `feat_login`)

5. **Example**

- `fe/dev/feat_api/#138`
- `common/dev/feat_auth/#138`
- `ios/dev/feat_login/#112`

---

### 📤 Commit

1. **커밋 메시지 형식**

- `[FE/BE/iOS/INFRA/COMMON] KEYWORD: 설명 #이슈번호`

2. **KEYWORD 목록**

- **FEAT**: 새로운 기능 추가 및 개선
- **FIX**: 기존 기능 수정 (안 좋았던 것에서 좋은 것으로)
- **BUG**: 버그 수정
- **REFACTOR**: 결과 변경 없이 코드 구조 재조정
- **TEST**: 테스트 코드 추가
- **DOCS**: 문서 수정
- **DELETE**: 파일 삭제
- **MOVE**: 파일/폴더명 수정 또는 경로 변경
- **ETC**: 기타 수정

3. **Example**

- `[COMMON] BUG: 로그인 시 쿠키 누락 버그 수정 #138`
- `[FE] FEAT: 회원가입 폼 추가 #42`
- `[COMMON] DOCS: readme에 AWS 관련 내용 추가 #4242`

---

### 🔀 Pull Request

1. **PR 제목 형식**

- 대괄호 `[]` 안에 키워드(FE, BE, iOS, INFRA, COMMON)를 작성합니다.
- 커밋 제목과 동일한 규칙을 적용합니다.
- 마지막에 이슈번호를 추가합니다.

2. **PR 내용**

- PR 내용 작성 시 **템플릿**을 사용합니다.

3. **Example**

- `[FE] FEAT: 회원가입 폼 추가 #42`
- `[BE] BUG: 로그인 시 쿠키 누락 버그 수정 #138`
