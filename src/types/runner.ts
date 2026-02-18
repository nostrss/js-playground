import type { RunnerMessage } from '@/types/console'

export type Runner = {
  execute: (code: string, runId: number) => Promise<void>
  dispose: () => void
}

export type RunnerOptions = {
  onMessage: (message: RunnerMessage) => void
}
