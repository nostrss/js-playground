// SYNC: lib/runner.ts srcdoc에도 동일 배열 존재. 수정 시 함께 변경 필요.
export const consoleLevels = ['log', 'info', 'warn', 'error', 'debug'] as const

export type ConsoleLevel = (typeof consoleLevels)[number]

export type ConsoleEventMessage = {
  type: 'console-event'
  runId: number
  level: ConsoleLevel
  args: string[]
  timestamp: number
}

export type RuntimeErrorMessage = {
  type: 'runtime-error'
  runId: number
  message: string
  stack: string | null
  timestamp: number
}

export type RunnerMessage = ConsoleEventMessage | RuntimeErrorMessage

export type RunnerCommand = {
  type: 'execute'
  runId: number
  code: string
}

export type ConsoleEntry = {
  id: string
  runId: number
  kind: 'console' | 'runtime-error'
  level: ConsoleLevel
  text: string
  stack: string | null
  timestamp: number
}
