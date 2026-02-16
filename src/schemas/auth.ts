import { z } from 'zod'

import { emailSchema } from './common'

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(72, '비밀번호는 72자 이하여야 합니다.'),
  rememberMe: z.boolean().default(false),
})

export type LoginForm = z.infer<typeof loginFormSchema>
