import { validate } from '@/utils/validate'
import { runnerCommandSchema, runnerMessageSchema } from '@/schemas/console'
import type { Runner, RunnerOptions } from '@/types/runner'

const runnerSrcDoc = `<!doctype html>
<html>
  <body>
    <script>
      (() => {
        // SYNC: types/console.ts consoleLevels와 동기화 필요.
        const levels = ['log', 'info', 'warn', 'error', 'debug']
        let activeRunId = null

        const serializeArg = (value) => {
          if (typeof value === 'string') return value
          if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
            return String(value)
          }
          if (typeof value === 'undefined') return 'undefined'
          if (typeof value === 'function') return '[Function ' + (value.name || 'anonymous') + ']'
          if (value instanceof Error) return value.stack || value.message

          try {
            return JSON.stringify(value)
          } catch {
            return Object.prototype.toString.call(value)
          }
        }

        const postMessage = (payload) => {
          parent.postMessage(payload, '*')
        }

        const postRuntimeError = (error) => {
          if (activeRunId === null) return

          postMessage({
            type: 'runtime-error',
            runId: activeRunId,
            message: error?.message ?? String(error),
            stack: error?.stack ?? null,
            timestamp: Date.now(),
          })
        }

        window.addEventListener('error', (event) => {
          postRuntimeError(event.error || new Error(event.message))
        })

        window.addEventListener('unhandledrejection', (event) => {
          const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
          postRuntimeError(reason)
        })

        window.addEventListener('message', (event) => {
          const command = event.data

          if (!command || command.type !== 'execute') {
            return
          }

          if (typeof command.code !== 'string' || !Number.isInteger(command.runId)) {
            return
          }

          const runId = command.runId
          activeRunId = runId

          const executionConsole = Object.fromEntries(
            levels.map((level) => [
              level,
              (...args) => {
                postMessage({
                  type: 'console-event',
                  runId,
                  level,
                  args: args.map(serializeArg),
                  timestamp: Date.now(),
                })
              },
            ]),
          )

          try {
            const executable = new Function('console', command.code)
            executable(executionConsole)
          } catch (error) {
            postRuntimeError(error)
          }
        })
      })()
    </script>
  </body>
</html>`

export function createRunner({ onMessage }: RunnerOptions): Runner {
  let isDisposed = false
  let frame: HTMLIFrameElement | null = null
  let readyPromise: Promise<void> | null = null

  const destroyFrame = () => {
    frame?.remove()
    frame = null
    readyPromise = null
  }

  const createFrame = () => {
    const nextFrame = document.createElement('iframe')
    nextFrame.setAttribute('sandbox', 'allow-scripts')
    nextFrame.setAttribute('aria-hidden', 'true')
    nextFrame.tabIndex = -1
    nextFrame.style.display = 'none'

    readyPromise = new Promise<void>((resolve, reject) => {
      nextFrame.onload = () => {
        resolve()
      }

      nextFrame.onerror = () => {
        reject(new Error('Runner iframe failed to load'))
      }
    })

    nextFrame.srcdoc = runnerSrcDoc
    document.body.appendChild(nextFrame)
    frame = nextFrame
  }

  const handleMessage = (event: MessageEvent<unknown>) => {
    if (!frame || event.source !== frame.contentWindow) {
      return
    }

    const parsed = validate(runnerMessageSchema, event.data)

    if (!parsed.ok) {
      return
    }

    onMessage(parsed.data)
  }

  window.addEventListener('message', handleMessage)

  const execute = async (code: string, runId: number) => {
    if (isDisposed) {
      return
    }

    destroyFrame()
    createFrame()

    if (!readyPromise || !frame) {
      return
    }

    try {
      await readyPromise
    } catch {
      return
    }

    const command = validate(runnerCommandSchema, {
      type: 'execute',
      runId,
      code,
    })

    if (!command.ok) {
      return
    }

    frame.contentWindow?.postMessage(command.data, '*')
  }

  const dispose = () => {
    isDisposed = true
    window.removeEventListener('message', handleMessage)
    destroyFrame()
  }

  return {
    execute,
    dispose,
  }
}
