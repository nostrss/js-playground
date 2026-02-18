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
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 선택, GA4 측정 ID
```

- `VITE_API_BASE_URL`: 필수, 유효한 URL이어야 함
- `VITE_APP_NAME`: 선택, 미설정 시 기본값 `JS Playground`
- `VITE_GA_MEASUREMENT_ID`: 선택, 미설정 또는 DEV 환경에서 자동 비활성화

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
- GA4 페이지 뷰 / 이벤트 추적 (운영 환경)

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
  main.tsx               # 엔트리 포인트: Monaco/Analytics 초기화 → React 렌더
  App.tsx                # 루트 컴포넌트
  types/                 # TypeScript 타입 정의 (theme, console, runner, validation, playground)
  constants/             # 런타임 상수 (theme palette, editor 설정, analytics ID)
  schemas/               # Zod 런타임 검증 스키마 (console, playground, env)
  utils/                 # Pure 함수 (validate, theme, console 변환, clamp)
  lib/
    runner.ts            # iframe 샌드박스 생성/실행/메시지 수집
    monacoEnvironment.ts # Monaco Editor Web Worker 등록
    analytics.ts         # GA4 gtag 스크립트 초기화 및 이벤트 추적
  hooks/
    useCodeRunner.ts     # Runner 생명주기 + 1초 디바운스 실행
    useMonacoEditor.ts   # Monaco Editor 인스턴스 관리
    useEditorTheme.ts    # 테마 선택 + localStorage 영속화
    useConsoleResize.ts  # 콘솔 패널 드래그 리사이즈
  components/
    Editor.tsx           # 메인 레이아웃: hooks 조합 + Editor/ConsolePanel 배치
    console/
      ConsolePanel.tsx   # 콘솔 패널 컨테이너
      ConsoleHeader.tsx  # 헤더 (타이틀 + 테마 드롭다운)
      LogList.tsx        # 로그 목록 렌더링 (level별 색상)
      ResizeHandle.tsx   # 드래그 핸들
tests/
  unit/                  # unit 테스트 (analytics, runner, theme, validation 등)
  component/             # 컴포넌트 테스트 (App, Editor)
  e2e/                   # Playwright 시나리오
```

## 동작 원리

```text
Monaco Editor 입력
  → useMonacoEditor (코드 변경 감지)
  → useCodeRunner (1초 디바운스)
  → Runner: iframe.postMessage({ execute })
  → iframe srcdoc: new Function('console', code)
  → postMessage → RunnerMessage
  → ConsolePanel 렌더링
```

1. `useMonacoEditor`가 Monaco 인스턴스를 관리하고 코드 변경을 감지
2. `useCodeRunner`가 1초 디바운스 후 Runner에 실행을 위임
3. `Runner`가 `sandbox="allow-scripts"` iframe을 생성하고 `srcdoc`에 콘솔 인터셉트 스크립트를 주입
4. iframe 내에서 `console.*` 호출과 런타임 에러를 `postMessage`로 부모에게 전달
5. `ConsolePanel`이 메시지를 `ConsoleEntry[]` 형태로 렌더링

핵심 파일:

- `src/components/Editor.tsx` — 레이아웃 조합
- `src/hooks/useCodeRunner.ts` — 실행 흐름 제어
- `src/lib/runner.ts` — iframe 샌드박스
- `src/components/console/ConsolePanel.tsx` — 출력 렌더링

## 테스트 가이드

### Unit / Component (Vitest)

- 환경: `jsdom`
- 설정: `vite.config.ts` (`test` 섹션), `src/test/setup.ts`
- 테스트 배치 규칙: `docs/rules/tests.md`
- Vitest globals 활성화 (`describe`, `it`, `expect` import 불필요)

```bash
pnpm test
pnpm test tests/unit/validation.test.ts
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

- 실행/로그 흐름 문제: `src/lib/runner.ts`, `src/hooks/useCodeRunner.ts`
- 에디터 상태/디바운스 문제: `src/hooks/useMonacoEditor.ts`
- 콘솔 렌더링/스타일 문제: `src/components/console/ConsolePanel.tsx`
- 테마 문제: `src/utils/theme.ts`, `src/constants/theme.ts`
- Analytics 문제: `src/lib/analytics.ts`

## 자주 발생하는 문제

- `VITE_API_BASE_URL은 유효한 URL이어야 합니다.`
  `.env`의 `VITE_API_BASE_URL` 값을 URL 형태로 수정하세요.
- E2E 포트 충돌
  `4173` 포트 사용 중인 프로세스를 종료하거나 Playwright 설정을 조정하세요.
- Monaco 관련 타입/로더 문제
  `src/lib/monacoEnvironment.ts` 초기화가 `src/main.tsx`에서 호출되는지 확인하세요.
