import { playgroundRuntimeConfigSchema } from '@/schemas/playground'

export const DEFAULT_CONSOLE_WIDTH = 360
export const MIN_CONSOLE_WIDTH = 280
export const MAX_CONSOLE_WIDTH = 720

export const runtimeConfig = playgroundRuntimeConfigSchema.parse({
  debounceMs: 1000,
  clearOnRun: true,
  initialCode: ['function demo() {', '  console.log("Hello world!")', '}', '', 'demo()'].join('\n'),
})
