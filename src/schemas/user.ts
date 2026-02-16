import { z } from 'zod'

import { displayNameSchema, emailSchema, idSchema } from './common'

export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: displayNameSchema,
  role: z.enum(['admin', 'member']),
})

export const userApiResponseSchema = z.object({
  user: userSchema,
  fetchedAt: z.string().datetime('응답 시간 형식이 올바르지 않습니다.'),
})

export type User = z.infer<typeof userSchema>
export type UserApiResponse = z.infer<typeof userApiResponseSchema>
