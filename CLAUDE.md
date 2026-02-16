# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Vite + React 19 + TypeScript 플레이그라운드. Tailwind CSS v4로 스타일링하고, Zod로 런타임 검증을 수행합니다.

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

```
src/
├── main.tsx          # React 루트 마운트
├── App.tsx           # 메인 컴포넌트 (Zod 검증 데모 + 카운터)
├── index.css         # Tailwind CSS 글로벌 임포트 (@import "tailwindcss")
├── lib/              # 유틸리티 함수
│   └── validation.ts # validateWithSchema<T>() — Zod safeParse 래퍼
├── schemas/          # Zod 스키마 정의
│   ├── common.ts     # 공통 스키마 (id, email, displayName)
│   ├── auth.ts       # 로그인 폼 스키마
│   ├── user.ts       # 사용자 + API 응답 스키마
│   └── env.ts        # 환경변수 스키마 (VITE_API_BASE_URL, VITE_APP_NAME)
└── test/
    └── setup.ts      # Vitest 셋업 (jest-dom 매처, cleanup)

tests/
└── e2e/              # Playwright E2E 테스트
```

### 검증 패턴

`lib/validation.ts`의 `validateWithSchema(schema, input)`은 `ValidationResult<T>` (Success | Failure)를 반환합니다. 새 스키마는 `schemas/`에 도메인별 파일로 추가하고, `common.ts`의 기본 스키마를 재사용하세요.

### 스타일링

Tailwind CSS v4는 `@tailwindcss/vite` 플러그인으로 통합됩니다. 별도 `tailwind.config.js` 없이 Vite 플러그인이 처리합니다.

## 테스트 파일 배치

[docs/rules/tests.md](docs/rules/tests.md)를 참고하세요.

## 환경변수

- `VITE_API_BASE_URL` — 필수, 유효한 URL
- `VITE_APP_NAME` — 선택, 기본값 `"JS Playground"`

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
