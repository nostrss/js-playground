import { useMemo, useState } from 'react'

import { validateWithSchema } from './lib/validation'
import { loginFormSchema } from './schemas/auth'
import { envSchema } from './schemas/env'
import { userApiResponseSchema } from './schemas/user'

const sampleApiResponse: unknown = {
  user: {
    id: 'u_1001',
    email: 'hello@example.com',
    name: 'Jin',
    role: 'owner',
  },
  fetchedAt: '2026-02-16T13:00:00.000Z',
}

const sampleLoginPayload: unknown = {
  email: 'invalid-email-format',
  password: '12345',
}

function formatFieldErrors(fieldErrors: Record<string, string[]>) {
  return Object.entries(fieldErrors)
    .filter(([, messages]) => messages.length > 0)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
}

function App() {
  const [count, setCount] = useState(0)

  const apiValidation = useMemo(
    () => validateWithSchema(userApiResponseSchema, sampleApiResponse),
    [],
  )
  const loginValidation = useMemo(
    () => validateWithSchema(loginFormSchema, sampleLoginPayload),
    [],
  )
  const envValidation = useMemo(() => validateWithSchema(envSchema, import.meta.env), [])

  const apiErrors = apiValidation.ok ? [] : formatFieldErrors(apiValidation.fieldErrors)
  const loginErrors = loginValidation.ok
    ? []
    : formatFieldErrors(loginValidation.fieldErrors)
  const envErrors = envValidation.ok ? [] : formatFieldErrors(envValidation.fieldErrors)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Zod Setup</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Vite + React + Zod</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          스키마 기반 런타임 검증(API, 폼 입력, 환경변수)을 기본 구조에 연결했습니다.
        </p>

        <div className="mt-8 rounded-xl bg-slate-50 p-6">
          <p className="text-sm text-slate-600">현재 카운트</p>
          <p className="mt-1 text-4xl font-bold text-slate-900">{count}</p>
          <button
            type="button"
            onClick={() => setCount((current) => current + 1)}
            className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            카운트 증가
          </button>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-700">
          <p>
            API 검증: {apiValidation.ok ? '성공' : '실패'}
            {apiErrors.length > 0 ? ` (${apiErrors.join(' / ')})` : ''}
          </p>
          <p>
            폼 검증: {loginValidation.ok ? '성공' : '실패'}
            {loginErrors.length > 0 ? ` (${loginErrors.join(' / ')})` : ''}
          </p>
          <p>
            ENV 검증: {envValidation.ok ? '성공' : '실패'}
            {envErrors.length > 0 ? ` (${envErrors.join(' / ')})` : ''}
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        추가 파일: <code>src/schemas/*</code>, <code>src/lib/validation.ts</code>
      </p>
    </main>
  )
}

export default App
