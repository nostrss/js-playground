# AGENTS.md

## 프로젝트 개요

브라우저 기반 JavaScript Playground. 좌측 Monaco Editor에서 코드를 작성하면 1초 디바운스 후 샌드박스(iframe)에서 자동 실행되어 우측 ConsolePanel에 결과를 출력합니다. Vite + React 19 + TypeScript로 구축되며, Tailwind CSS v4로 스타일링하고, Zod로 런타임 검증을 수행합니다.

운영 URL: `https://www.nostrss.me/playground`

## 빌드, 테스트, 개발 명령어

패키지 매니저: `pnpm`

### 개발 및 빌드

- `pnpm dev` — Vite 개발 서버(HMR)
- `pnpm build` — `tsc -b && vite build` (타입 체크 + 프로덕션 빌드)
- `pnpm preview` — 프로덕션 빌드 로컬 서빙
- `pnpm lint` — ESLint 실행

PR 전 반드시: `pnpm lint && pnpm build`

### 단위/컴포넌트 테스트 (Vitest)

- `pnpm test` — 전체 테스트 1회 실행
- `pnpm test:watch` — 워치 모드
- `pnpm test:ui` — Vitest UI
- `pnpm coverage` — 커버리지 리포트 생성 (`./coverage/`)
- 단일 파일 테스트: `pnpm test src/lib/validation.test.ts`

Vitest globals가 활성화되어 있어 `describe`, `it`, `expect`를 import 없이 사용 가능합니다.
테스트 환경은 jsdom이며, 설정 파일은 `src/test/setup.ts` (`@testing-library/jest-dom` 매처 등록).

### E2E 테스트 (Playwright)

- `pnpm e2e` — 헤드리스 실행
- `pnpm e2e:headed` — 브라우저 표시
- `pnpm e2e:ui` — Playwright UI
- `pnpm e2e:report` — 리포트 열기

브라우저: Chromium만 사용. 베이스 URL: `http://127.0.0.1:4173`.
Playwright가 자동으로 `pnpm dev --host 127.0.0.1 --port 4173`으로 서버를 시작합니다.

## 아키텍처

### 초기화 순서

`main.tsx`에서 React 마운트 전에 두 가지 초기화를 수행합니다:

1. `initMonacoEnvironment()` — Monaco Editor Web Worker 등록 (`lib/monacoEnvironment.ts`). `window.__MONACO_ENV_INITIALIZED__` 플래그로 중복 실행 방지.
2. `initAnalytics()` + `trackPageView()` — GA4 gtag 스크립트 동적 삽입 (`lib/analytics.ts`). `import.meta.env.DEV`일 때 자동 비활성화.

### 핵심 흐름

`App` → `Editor` → `ConsolePanel` 구조의 단일 페이지 앱입니다.

1. **Editor** (`components/Editor.tsx`): Monaco Editor 인스턴스를 관리. 코드 변경 시 `useState`로 `code` 상태를 업데이트하고, `useEffect` 내 `setTimeout`으로 1초 디바운스 후 Runner에 실행을 위임합니다.
2. **Runner** (`lib/runner.ts`): `sandbox="allow-scripts"` iframe을 동적으로 생성하고 `srcdoc`에 콘솔 인터셉트 스크립트를 주입합니다. `postMessage`로 코드를 전달하고, iframe 내에서 `new Function('console', code)`로 실행합니다. `console.*` 호출과 runtime error를 `postMessage`로 부모에게 전달합니다.
3. **ConsolePanel** (`components/ConsolePanel.tsx`): Runner로부터 받은 메시지를 `ConsoleEntry[]` 형태로 렌더링. 드래그로 패널 너비 조절 가능.

### 타입-스키마 이중 구조

도메인 타입은 `types/`에 TypeScript 타입으로, 런타임 검증은 `schemas/`에 Zod 스키마로 정의합니다. `lib/validation.ts`의 `validateWithSchema(schema, input)`이 `ValidationResult<T>` (Success | Failure)를 반환하는 래퍼입니다. 새 스키마는 `schemas/`에 도메인별 파일로 추가하고, `common.ts`의 기본 스키마를 재사용하세요.

### 테마 시스템

`lib/monacoThemes.ts`에서 Monaco Editor 테마와 ConsolePanel 테마 스타일을 함께 관리합니다. `MonacoThemeId` 리터럴 유니온(`'vs' | 'dracula' | 'vs-dark'`)으로 타입 안전하게 관리하며, `localStorage`에 선택 테마를 영속화합니다.

### Path alias

`@/` → `src/` (vite.config.ts의 resolve.alias와 tsconfig.json의 paths에서 설정)

### 스타일링

Tailwind CSS v4는 `@tailwindcss/vite` 플러그인으로 통합됩니다. 별도 `tailwind.config.js` 없이 Vite 플러그인이 처리합니다.

### SEO

CSR 앱 기준 최소 SEO 설정: `index.html` (메타 태그), `public/robots.txt`, `public/sitemap.xml`. 운영 URL 변경 시 세 파일을 함께 수정해야 합니다.

## 테스트 파일 배치

[docs/rules/tests.md](docs/rules/tests.md)를 참고하세요. 요약:

- `unit` 테스트: `tests/unit/*.test.ts`
- `component` 테스트: `tests/component/*.test.tsx`
- `e2e` 테스트: `tests/e2e/*.spec.ts`

타입이 다른 테스트를 같은 디렉터리에 섞지 않습니다.

## 환경변수

- `VITE_API_BASE_URL` — 필수, 유효한 URL
- `VITE_APP_NAME` — 선택, 기본값 `"JS Playground"`
- `VITE_GA_MEASUREMENT_ID` — 선택, GA4 측정 ID. 미설정 또는 DEV 환경에서 자동 비활성화

`schemas/env.ts`에서 Zod로 검증됩니다.

## 코딩 스타일

- ES 모듈 TypeScript (`.ts`, `.tsx`), 스페이스 2칸
- 컴포넌트/파일: PascalCase, 변수/함수: camelCase
- 함수형 컴포넌트 + 훅 우선
- import 그룹화: 외부 의존성 → 로컬 모듈
- TypeScript strict 모드 (`noUnusedLocals`, `noUnusedParameters` 등)
- Lint 규칙: `eslint.config.js` (ESLint 9 flat config)

세부 규칙은 `clean-code` skill을 참고하세요.

## 사용 가능한 skill

- `modern-javascript-patterns`, `typescript-advanced-types`, `clean-code`
- `vercel-react-best-practices`, `web-design-guidelines`
- `vitest`, `javascript-testing-patterns`
- `commit-work`

## 커밋 가이드라인

- `commit-work` skill을 사용하여 커밋하세요.
- 반드시 **한국어**로 커밋 메시지를 작성하세요.
- 반드시 결과를 알려줄 때 사용한 **skill**을 알려주세요.
