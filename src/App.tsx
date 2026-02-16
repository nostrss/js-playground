import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Tailwind CSS v4
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Vite + React</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          설치와 설정이 완료되었습니다. 아래 버튼으로 상태를 확인할 수 있습니다.
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
      </div>
      <p className="mt-6 text-xs text-slate-500">
        수정 파일: <code>vite.config.ts</code>, <code>src/index.css</code>,{' '}
        <code>src/App.tsx</code>
      </p>
    </main>
  )
}

export default App
