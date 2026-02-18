import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => ({
  default: vi.fn(),
}))

vi.mock('monaco-editor/esm/vs/language/typescript/ts.worker?worker', () => ({
  default: vi.fn(),
}))

describe('initMonacoEnvironment', () => {
  beforeEach(() => {
    delete window.MonacoEnvironment
    delete window.__MONACO_ENV_INITIALIZED__
    vi.resetModules()
  })

  afterEach(() => {
    delete window.MonacoEnvironment
    delete window.__MONACO_ENV_INITIALIZED__
  })

  it('첫 호출 시 window.MonacoEnvironment를 설정한다', async () => {
    const { initMonacoEnvironment } = await import('@/lib/monacoEnvironment')

    initMonacoEnvironment()

    expect(window.MonacoEnvironment).toBeDefined()
    expect(window.MonacoEnvironment?.getWorker).toBeInstanceOf(Function)
    expect(window.__MONACO_ENV_INITIALIZED__).toBe(true)
  })

  it('중복 호출 시 덮어쓰기를 방지한다', async () => {
    const { initMonacoEnvironment } = await import('@/lib/monacoEnvironment')

    initMonacoEnvironment()
    const firstEnvironment = window.MonacoEnvironment

    initMonacoEnvironment()

    expect(window.MonacoEnvironment).toBe(firstEnvironment)
  })
})
