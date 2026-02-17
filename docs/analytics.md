# Google Analytics (GA4)

## 개요

프로젝트는 GA4를 `gtag` 방식으로 연동합니다.

- `import.meta.env.DEV === true`인 로컬 개발 환경에서는 GA를 강제로 비활성화합니다.
- 프로덕션/프리뷰 환경에서는 `VITE_GA_MEASUREMENT_ID`를 사용하며, 값이 없으면 추적 함수는 동작하지 않습니다(no-op).

## 초기화 흐름

- 파일: `src/main.tsx`
- 호출:
  - `initAnalytics()`
  - `trackPageView(window.location.pathname + window.location.search)`

초기화 시 `send_page_view: false`로 설정하고, 페이지뷰는 코드에서 명시적으로 전송합니다.

## 이벤트 정의

### `page_view`

- 호출 위치: `src/main.tsx`
- 파라미터:
  - `page_path` (string)

### `code_run`

- 호출 위치: `src/components/Editor.tsx`
- 파라미터:
  - `source` = `editor`
  - `run_id` (number)

### `runtime_error`

- 호출 위치: `src/components/Editor.tsx`
- 파라미터:
  - `source` = `runner`
  - `run_id` (number)
  - `error_type` = `runtime-error`

### `theme_change`

- 호출 위치: `src/components/Editor.tsx`
- 파라미터:
  - `source` = `console-panel`
  - `theme` (string)

## 운영 확인 방법

1. 로컬 개발(`pnpm dev`):
   - 브라우저 Network에서 `googletagmanager` 스크립트가 로드되지 않는지 확인
   - `page_view`, `code_run`, `runtime_error`, `theme_change` 전송이 발생하지 않는지 확인
2. 프리뷰/운영(`pnpm build && pnpm preview`):
   - `googletagmanager` 스크립트 로드 확인
   - GA4 DebugView에서 이벤트 수신 확인
