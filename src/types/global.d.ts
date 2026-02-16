export {}

declare global {
  interface Window {
    MonacoEnvironment?: {
      getWorker: (workerId: string, label: string) => Worker
    }
    __MONACO_ENV_INITIALIZED__?: boolean
  }
}
