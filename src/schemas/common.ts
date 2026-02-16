import { z } from 'zod'

export const idSchema = z.string().trim().min(1, 'ID는 비어 있을 수 없습니다.')

export const emailSchema = z
  .string()
  .trim()
  .email('유효한 이메일 형식이 아닙니다.')

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, '이름은 2자 이상이어야 합니다.')
  .max(30, '이름은 30자 이하여야 합니다.')
