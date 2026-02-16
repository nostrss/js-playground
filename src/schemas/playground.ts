import { z } from 'zod'

import type { PlaygroundRuntimeConfig } from '@/types/playground'

export const playgroundRuntimeConfigSchema: z.ZodType<PlaygroundRuntimeConfig> = z.object({
  debounceMs: z.number().int().positive(),
  clearOnRun: z.boolean(),
  initialCode: z.string(),
})
