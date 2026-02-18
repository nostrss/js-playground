import type { ConsoleEntry, RunnerMessage } from '@/types/console'

export function toEntry(message: RunnerMessage, index: number): ConsoleEntry {
  if (message.type === 'runtime-error') {
    return {
      id: `${message.runId}-runtime-error-${index}`,
      runId: message.runId,
      kind: 'runtime-error',
      level: 'error',
      text: message.message,
      stack: message.stack,
      timestamp: message.timestamp,
    }
  }

  return {
    id: `${message.runId}-${message.level}-${index}`,
    runId: message.runId,
    kind: 'console',
    level: message.level,
    text: message.args.join(' '),
    stack: null,
    timestamp: message.timestamp,
  }
}
