# 테스트 코드 작성 규칙

## 1) 목적

- 이 문서는 프로젝트 내 테스트 코드의 작성/배치 규칙을 정의한다.
- 모든 테스트는 아래 3가지 타입으로만 작성한다.
  - `unit` 테스트
  - `component` 테스트
  - `e2e` 테스트

## 2) 테스트 타입과 디렉터리

- `unit` 테스트: `tests/unit`
- `component` 테스트: `tests/component`
- `e2e` 테스트: `tests/e2e`

타입이 다른 테스트를 같은 디렉터리에 섞지 않는다.

## 3) 파일 네이밍 규칙

- `unit`: `*.test.ts`
- `component`: `*.test.tsx`
- `e2e`: `*.spec.ts`

예시:

- `tests/unit/validation.test.ts`
- `tests/component/App.test.tsx`
- `tests/e2e/app.smoke.spec.ts`

## 4) 사용 가능한 스킬

- `vitest`
- `javascript-testing-patterns`
