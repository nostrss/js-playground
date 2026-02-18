import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { validate } from '@/utils/validate'

describe('validate', () => {
  const sampleSchema = z.object({
    email: z.string().email('이메일 형식 오류'),
    age: z.number().int().min(18, '성인만 허용'),
  })

  it('유효한 입력을 성공으로 반환한다', () => {
    const result = validate(sampleSchema, {
      email: 'valid@example.com',
      age: 20,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.email).toBe('valid@example.com')
      expect(result.data.age).toBe(20)
    }
  })

  it('무효한 입력을 실패와 필드 에러로 반환한다', () => {
    const result = validate(sampleSchema, {
      email: 'invalid-email',
      age: 13,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fieldErrors.email).toContain('이메일 형식 오류')
      expect(result.fieldErrors.age).toContain('성인만 허용')
    }
  })
})
