# JS Playground

Vite + React + TypeScript 기반 JavaScript Playground입니다.

- 좌측: Monaco Editor에서 JavaScript 코드 작성
- 우측: 실행 결과 Console 출력
- 코드 변경 후 1000ms 디바운스로 자동 실행
- `console.*` 출력과 runtime error를 함께 표시

## 실행

```bash
pnpm dev
```

## 품질 검사

```bash
pnpm lint
pnpm build
pnpm test
```

## E2E 테스트 (Playwright)

패키지와 브라우저가 설치되어 있다는 전제로 동작합니다.

```bash
# 헤드리스 실행
pnpm e2e

# 브라우저 표시 실행
pnpm e2e:headed

# Playwright UI 모드
pnpm e2e:ui

# HTML 리포트 열기
pnpm e2e:report
```
