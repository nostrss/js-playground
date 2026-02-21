import { useCallback, useEffect, useRef, useState } from 'react'

import { createRunner } from '@/lib/runner'
import { trackEvent } from '@/lib/analytics'
import { toEntry } from '@/utils/console'
import { CODE_STORAGE_KEY } from '@/constants/editor'
import { saveCode } from '@/utils/storage'
import type { ConsoleEntry, RunnerMessage } from '@/types/console'

type UseCodeRunnerOptions = {
  debounceMs: number
  clearOnRun: boolean
  initialCode: string
}

export function useCodeRunner({ debounceMs, clearOnRun, initialCode }: UseCodeRunnerOptions) {
  const activeRunIdRef = useRef(0)
  const runnerRef = useRef<ReturnType<typeof createRunner> | null>(null)

  const [code, setCode] = useState(initialCode)
  const [logs, setLogs] = useState<ConsoleEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const handleRunnerMessage = useCallback((message: RunnerMessage) => {
    if (message.runId !== activeRunIdRef.current) {
      return
    }

    if (message.type === 'runtime-error') {
      trackEvent('runtime_error', {
        source: 'runner',
        run_id: message.runId,
        error_type: 'runtime-error',
      })
    }

    setLogs((current) => [...current, toEntry(message, current.length)])
  }, [])

  useEffect(() => {
    runnerRef.current = createRunner({ onMessage: handleRunnerMessage })

    return () => {
      runnerRef.current?.dispose()
      runnerRef.current = null
    }
  }, [handleRunnerMessage])

  useEffect(() => {
    const runner = runnerRef.current
    if (!runner) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const nextRunId = activeRunIdRef.current + 1
      activeRunIdRef.current = nextRunId

      setIsRunning(true)
      if (clearOnRun) {
        setLogs([])
      }

      trackEvent('code_run', {
        source: 'editor',
        run_id: nextRunId,
      })

      const execution = runner.execute(code, nextRunId)

      void execution?.finally(() => {
        if (activeRunIdRef.current === nextRunId) {
          setIsRunning(false)
        }
      })
    }, debounceMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [code, debounceMs, clearOnRun])

  useEffect(() => {
    saveCode(CODE_STORAGE_KEY, code)
  }, [code])

  return { code, setCode, logs, isRunning }
}
