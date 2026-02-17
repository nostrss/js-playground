# JS Playground

브라우저에서 JavaScript 코드를 즉시 실행하고, 결과를 우측 콘솔에서 확인하는 학습/실험용 Playground입니다.

## 빠른 시작

### 1) 사전 준비

- Node.js 20+ 권장
- pnpm 설치

### 2) 프로젝트 설치

```bash
pnpm install
```

### 3) 환경변수 설정

루트에 `.env` 파일을 만들고 아래 값을 설정하세요.

```bash
VITE_API_BASE_URL=http://127.0.0.1:4173
VITE_APP_NAME=JS Playground
```

- `VITE_API_BASE_URL`: 필수, 유효한 URL이어야 함
- `VITE_APP_NAME`: 선택, 미설정 시 기본값 `JS Playground`

### 4) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 표시된 주소로 접속한 뒤, 에디터 코드 변경 시 우측 `Console` 패널에 결과가 자동으로 갱신되면 정상입니다.

## 주요 기능

- Monaco Editor 기반 코드 작성
- 코드 변경 후 1초(1000ms) 디바운스 자동 실행
- `iframe sandbox="allow-scripts"` 기반 실행 격리
- `console.log/info/warn/error/debug` 출력 수집
- 런타임 에러 및 스택 출력
- 콘솔 패널 너비 드래그 조절
- 에디터 테마 선택 및 로컬 스토리지 저장

## SEO 기본 설정

CSR 앱 기준으로 최소 SEO 구성을 적용했습니다.

- `index.html`: `description`, `canonical`, Open Graph, Twitter 메타 태그
- `public/robots.txt`: 전체 크롤링 허용 + 사이트맵 위치
- `public/sitemap.xml`: 루트 URL(`/playground`) 등록

현재 기준 URL은 `https://www.nostrss.me/playground`입니다. 운영 URL이 바뀌면 아래 파일을 함께 수정하세요.

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

## 기술 스택

- Vite 7
- React 19 + TypeScript (strict)
- Monaco Editor
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Zod (런타임 스키마 검증)
- Vitest + Testing Library (unit/component)
- Playwright (e2e, Chromium)

## 개발 명령어

```bash
# 개발 서버
pnpm dev

# 프로덕션 빌드 (타입 체크 포함)
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 린트
pnpm lint

# 단위/컴포넌트 테스트
pnpm test
pnpm test:watch
pnpm test:ui
pnpm coverage

# e2e 테스트
pnpm e2e
pnpm e2e:headed
pnpm e2e:ui
pnpm e2e:report
```

PR 전 권장 검증:

```bash
pnpm lint && pnpm build
```

## 프로젝트 구조

```text
src/
  components/
    Editor.tsx         # Monaco 편집기 + 실행 트리거 + 레이아웃
    ConsolePanel.tsx   # 콘솔 출력 렌더링 + 리사이즈 + 테마 셀렉트
  lib/
    runner.ts          # iframe 생성/실행/메시지 수집
    monacoThemes.ts    # Monaco/Console 테마 정의
    validation.ts      # Zod 검증 래퍼
  schemas/             # 런타임 검증 스키마
  types/               # 도메인 타입
tests/
  unit/                # unit 테스트
  component/           # 컴포넌트 테스트
  e2e/                 # Playwright 시나리오
```

## 동작 원리

```text
Editor 입력 -> 1초 디바운스 -> Runner(iframe) 실행 -> postMessage -> ConsolePanel 렌더링
```

1. `Editor`가 코드 변경을 감지하고 1초 디바운스 후 실행 요청  
2. `Runner`가 샌드박스 iframe을 만들고 코드를 실행  
3. iframe 내부에서 `console.*`/runtime error를 `postMessage`로 전달  
4. `ConsolePanel`이 메시지를 목록으로 렌더링

핵심 파일:

- `src/components/Editor.tsx`
- `src/lib/runner.ts`
- `src/components/ConsolePanel.tsx`

## 테스트 가이드

### Unit / Component (Vitest)

- 환경: `jsdom`
- 설정: `vite.config.ts` (`test` 섹션), `src/test/setup.ts`
- 테스트 배치 규칙: `docs/rules/tests.md`

```bash
pnpm test
pnpm test src/lib/validation.test.ts
```

### E2E (Playwright)

- 브라우저: Chromium
- baseURL: `http://127.0.0.1:4173`
- 실행 시 `pnpm dev --host 127.0.0.1 --port 4173` 자동 기동

```bash
pnpm e2e
```

## 처음 기여하기

1. 이슈/요구사항 확인 후 브랜치 생성
2. 코드 수정 + 테스트 실행
3. PR 전에 `pnpm lint && pnpm build` 통과 확인

## 디버깅 시작점

- 실행/로그 흐름 문제: `src/lib/runner.ts`
- 에디터 상태/디바운스 문제: `src/components/Editor.tsx`
- 콘솔 렌더링/스타일 문제: `src/components/ConsolePanel.tsx`
- 테마 문제: `src/lib/monacoThemes.ts`

## 자주 발생하는 문제

- `VITE_API_BASE_URL은 유효한 URL이어야 합니다.`  
  `.env`의 `VITE_API_BASE_URL` 값을 URL 형태로 수정하세요.
- E2E 포트 충돌  
  `4173` 포트 사용 중인 프로세스를 종료하거나 Playwright 설정을 조정하세요.
- Monaco 관련 타입/로더 문제  
  `src/lib/monacoEnvironment.ts` 초기화가 `src/main.tsx`에서 호출되는지 확인하세요.
