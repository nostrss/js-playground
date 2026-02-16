import { z } from 'zod'

import { consoleLevels } from '@/types/console'
import type {
  ConsoleEventMessage,
  RunnerCommand,
  RunnerMessage,
  RuntimeErrorMessage,
} from '@/types/console'

const consoleLevelSchema = z.enum(consoleLevels)

export const consoleEventMessageSchema: z.ZodType<ConsoleEventMessage> = z.object({
  type: z.literal('console-event'),
  runId: z.number().int().nonnegative(),
  level: consoleLevelSchema,
  args: z.array(z.string()),
  timestamp: z.number().finite(),
})

export const runtimeErrorMessageSchema: z.ZodType<RuntimeErrorMessage> = z.object({
  type: z.literal('runtime-error'),
  runId: z.number().int().nonnegative(),
  message: z.string(),
  stack: z.string().nullable(),
  timestamp: z.number().finite(),
})

export const runnerMessageSchema: z.ZodType<RunnerMessage> = z.union([
  consoleEventMessageSchema,
  runtimeErrorMessageSchema,
])

export const runnerCommandSchema: z.ZodType<RunnerCommand> = z.object({
  type: z.literal('execute'),
  runId: z.number().int().nonnegative(),
  code: z.string(),
})
