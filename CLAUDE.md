# 저장소 가이드라인

## 프로젝트 구조 및 모듈 구성

이 저장소는 Vite + React + TypeScript 플레이그라운드입니다.

- `src/`: 애플리케이션 소스 코드.
- `src/main.tsx`: 앱 부트스트랩 및 React 루트 마운트.
- `src/App.tsx`: 메인 샘플 컴포넌트.
- `src/assets/`: 소스 파일에서 import하는 정적 에셋.
- `public/`: 변환 없이 그대로 제공되는 파일(예: `public/vite.svg`).
- 루트 설정 파일: `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`.

새 기능 코드는 `src/`에 두고, 관련 스타일/에셋은 가능하면 해당 컴포넌트 근처에 함께 배치하세요.

## 빌드, 테스트, 개발 명령어

`pnpm`을 사용합니다(락파일: `pnpm-lock.yaml`).

- `pnpm dev`: HMR이 활성화된 Vite 개발 서버를 시작합니다.
- `pnpm build`: TypeScript 빌드(`tsc -b`)를 실행하고 프로덕션 번들을 생성합니다.
- `pnpm preview`: 프로덕션 빌드를 로컬에서 서빙합니다.
- `pnpm lint`: 프로젝트 전체에 ESLint를 실행합니다.

PR을 열기 전에 `pnpm lint && pnpm build`를 실행하세요.

## 사용가능한 skill

- `modern-javascript-patterns`
- `vercel-react-best-practices`
- `javascript-testing-patterns`
- `typescript-advanced-types`
- `clean-code`
- `vitest`
- `web-design-guidelines`
- `commit-work`

## 코딩 스타일 및 네이밍 규칙

- 언어: ES 모듈 기반 TypeScript(`.ts`, `.tsx`).
- 들여쓰기: 스페이스 2칸, 기존 파일의 포맷을 일관되게 유지.
- 컴포넌트: PascalCase 파일/컴포넌트 이름 사용(예: `UserCard.tsx`).
- 변수/함수: camelCase 사용.
- 함수형 React 컴포넌트와 훅 사용을 우선.
- import는 명시적으로 작성하고 그룹화 유지(외부 의존성 먼저, 로컬 모듈 나중).
- 그 외의 규칙은 `clean-code` skill을 참고하세요.

Lint 규칙은 `eslint.config.js`(`@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`)에서 정의됩니다. 병합 전에 lint 경고를 해결하세요.

## 자바 스크립트, 타입스크립트 가이드 라인

아래 skill을 참고하세요.

- `modern-javascript-patterns`
- `typescript-advanced-types`
- `clean-code`

## 리액트 가이드 라인

아래 skill을 참고하세요.

- `vercel-react-best-practices`
- `web-design-guidelines`

## 테스트 가이드라인

아래 skill을 참고하세요.

- `vitest`
- `javascript-testing-patterns`

현재 `package.json`에는 자동화된 테스트 프레임워크가 설정되어 있지 않습니다.

현재 기준:

- `pnpm dev`, `pnpm lint`, `pnpm build`로 변경 사항을 검증하세요.
- 동작 변화가 큰 기능을 추가할 경우 PR 설명에 짧은 수동 테스트 계획을 포함하세요.

향후 테스트를 추가한다면 `src/` 아래에 `ComponentName.test.tsx` 같은 명확한 이름으로 배치하세요.

## 사용 가능한 MCP

아래 MCP를 참고하세요.

- `chrome-devtools`

## 커밋 및 Pull Request 가이드라인

아래 skill을 참고하세요.

- `commit-work` skill을 사용하여 커밋하세요.
