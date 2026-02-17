import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/editor/editor.main.js'

import {
  DEFAULT_THEME_ID,
  MONACO_THEME_OPTIONS,
  THEME_STORAGE_KEY,
  type MonacoThemeId,
  registerMonacoThemes,
  resolveStoredTheme,
} from '@/lib/monacoThemes'
import { createRunner } from '@/lib/runner'
import { trackEvent } from '@/lib/analytics'
import { playgroundRuntimeConfigSchema } from '@/schemas/playground'
import type { ConsoleEntry, RunnerMessage } from '@/types/console'

import { ConsolePanel } from './ConsolePanel'

const runtimeConfig = playgroundRuntimeConfigSchema.parse({
  debounceMs: 1000,
  clearOnRun: true,
  initialCode: ['function demo() {', '  console.log("Hello world!")', '}', '', 'demo()'].join('\n'),
})

const DEFAULT_CONSOLE_WIDTH = 360
const MIN_CONSOLE_WIDTH = 280
const MAX_CONSOLE_WIDTH = 720

function clampConsoleWidth(width: number) {
  return Math.min(MAX_CONSOLE_WIDTH, Math.max(MIN_CONSOLE_WIDTH, width))
}

function createConsoleEntry(message: RunnerMessage, index: number): ConsoleEntry {
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

export const Editor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeRunIdRef = useRef(0)
  const runnerRef = useRef<ReturnType<typeof createRunner> | null>(null)
  const dragMoveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null)
  const dragEndHandlerRef = useRef<(() => void) | null>(null)

  const [code, setCode] = useState(runtimeConfig.initialCode)
  const [logs, setLogs] = useState<ConsoleEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [consoleWidth, setConsoleWidth] = useState(DEFAULT_CONSOLE_WIDTH)
  const [selectedTheme, setSelectedTheme] = useState<MonacoThemeId>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME_ID
    }

    return resolveStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
  })

  const stopConsoleResize = useCallback(() => {
    if (dragMoveHandlerRef.current) {
      window.removeEventListener('mousemove', dragMoveHandlerRef.current)
      dragMoveHandlerRef.current = null
    }

    if (dragEndHandlerRef.current) {
      window.removeEventListener('mouseup', dragEndHandlerRef.current)
      dragEndHandlerRef.current = null
    }
  }, [])

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

    setLogs((current) => [...current, createConsoleEntry(message, current.length)])
  }, [])

  useEffect(() => {
    runnerRef.current = createRunner({ onMessage: handleRunnerMessage })

    return () => {
      runnerRef.current?.dispose()
      runnerRef.current = null
    }
  }, [handleRunnerMessage])

  useEffect(() => {
    return () => {
      stopConsoleResize()
    }
  }, [stopConsoleResize])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    registerMonacoThemes(monaco)

    const editorInstance = monaco.editor.create(containerRef.current, {
      value: runtimeConfig.initialCode,
      language: 'javascript',
      automaticLayout: true,
      minimap: { enabled: false },
    })

    const contentListener = editorInstance.onDidChangeModelContent(() => {
      setCode(editorInstance.getValue())
    })

    return () => {
      contentListener.dispose()
      editorInstance.dispose()
    }
  }, [])

  useEffect(() => {
    monaco.editor.setTheme(selectedTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme)
  }, [selectedTheme])

  const handleThemeChange = useCallback((nextTheme: MonacoThemeId) => {
    setSelectedTheme(nextTheme)
    trackEvent('theme_change', {
      source: 'console-panel',
      theme: nextTheme,
    })
  }, [])

  useEffect(() => {
    const runner = runnerRef.current
    if (!runner) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const nextRunId = activeRunIdRef.current + 1
      activeRunIdRef.current = nextRunId

      setIsRunning(true)
      if (runtimeConfig.clearOnRun) {
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
    }, runtimeConfig.debounceMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [code])

  const handleConsoleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()

      const startClientX = event.clientX
      const startWidth = consoleWidth

      stopConsoleResize()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startClientX - moveEvent.clientX
        setConsoleWidth(clampConsoleWidth(startWidth + delta))
      }

      const handleMouseUp = () => {
        stopConsoleResize()
      }

      dragMoveHandlerRef.current = handleMouseMove
      dragEndHandlerRef.current = handleMouseUp

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [consoleWidth, stopConsoleResize],
  )

  return (
    <div className='h-full w-full overflow-auto'>
      <div className='flex h-full min-w-[960px]' data-testid='playground-layout'>
        <section className='h-full min-w-0 flex-1' data-testid='editor-panel'>
          <div ref={containerRef} className='h-full w-full' />
        </section>
        <ConsolePanel
          logs={logs}
          isRunning={isRunning}
          width={consoleWidth}
          selectedTheme={selectedTheme}
          themeOptions={MONACO_THEME_OPTIONS}
          onThemeChange={handleThemeChange}
          onResizeStart={handleConsoleResizeStart}
        />
      </div>
    </div>
  )
}
