import { describe, expect, it } from 'vitest'

import {
  consoleEventMessageSchema,
  runnerCommandSchema,
  runnerMessageSchema,
  runtimeErrorMessageSchema,
} from '@/schemas/console'

describe('console schema', () => {
  it('console event 메시지를 검증한다', () => {
    const result = consoleEventMessageSchema.safeParse({
      type: 'console-event',
      runId: 1,
      level: 'log',
      args: ['hello', 'world'],
      timestamp: Date.now(),
    })

    expect(result.success).toBe(true)
  })

  it('runtime error 메시지를 검증한다', () => {
    const result = runtimeErrorMessageSchema.safeParse({
      type: 'runtime-error',
      runId: 2,
      message: 'boom',
      stack: null,
      timestamp: Date.now(),
    })

    expect(result.success).toBe(true)
  })

  it('runner message는 잘못된 payload를 거부한다', () => {
    const result = runnerMessageSchema.safeParse({
      type: 'console-event',
      runId: 1,
      level: 'invalid',
      args: ['hello'],
      timestamp: Date.now(),
    })

    expect(result.success).toBe(false)
  })

  it('runner command를 검증한다', () => {
    const result = runnerCommandSchema.safeParse({
      type: 'execute',
      runId: 3,
      code: 'console.log("ok")',
    })

    expect(result.success).toBe(true)
  })
})
