import { z } from 'zod'

export const envSchema = z
  .object({
    VITE_API_BASE_URL: z.url('VITE_API_BASE_URL은 유효한 URL이어야 합니다.'),
    VITE_APP_NAME: z.string().trim().min(1).default('JS Playground'),
  })
  .passthrough()

export type AppEnv = z.infer<typeof envSchema>
