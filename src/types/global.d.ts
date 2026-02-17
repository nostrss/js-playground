export {}

declare global {
  type GtagCommand = 'js' | 'config' | 'event'
  type GtagParams = Record<string, string | number | boolean | null | undefined>

  interface Window {
    MonacoEnvironment?: {
      getWorker: (workerId: string, label: string) => Worker
    }
    __MONACO_ENV_INITIALIZED__?: boolean
    dataLayer?: unknown[][]
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParams) => void
  }
}
