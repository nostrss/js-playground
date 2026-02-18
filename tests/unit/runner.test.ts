import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createRunner } from '@/lib/runner'

describe('createRunner', () => {
  let onMessage: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onMessage = vi.fn()
  })

  afterEach(() => {
    document.querySelectorAll('iframe').forEach((frame) => frame.remove())
  })

  it('execute 호출 시 sandbox iframe을 생성한다', async () => {
    const runner = createRunner({ onMessage })

    await runner.execute('console.log("test")', 1)

    const iframes = document.querySelectorAll('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('sandbox')).toBe('allow-scripts')
    expect(iframes[0].getAttribute('aria-hidden')).toBe('true')

    runner.dispose()
  })

  it('dispose 후 iframe을 제거한다', async () => {
    const runner = createRunner({ onMessage })

    await runner.execute('console.log("test")', 1)
    expect(document.querySelectorAll('iframe').length).toBe(1)

    runner.dispose()
    expect(document.querySelectorAll('iframe').length).toBe(0)
  })

  it('dispose 후 execute를 무시한다', async () => {
    const runner = createRunner({ onMessage })

    runner.dispose()
    await runner.execute('console.log("test")', 1)

    expect(document.querySelectorAll('iframe').length).toBe(0)
  })

  it('재실행 시 이전 iframe을 교체한다', async () => {
    const runner = createRunner({ onMessage })

    await runner.execute('console.log("first")', 1)
    const firstFrame = document.querySelector('iframe')

    await runner.execute('console.log("second")', 2)
    const secondFrame = document.querySelector('iframe')

    expect(document.querySelectorAll('iframe').length).toBe(1)
    expect(secondFrame).not.toBe(firstFrame)

    runner.dispose()
  })
})
