import { z } from 'zod'

import type { ValidationErrors, ValidationResult } from '@/types/validation'

function normalizeErrors(
  rawFieldErrors: Record<string, string[] | undefined>,
): ValidationErrors {
  return Object.entries(rawFieldErrors).reduce<ValidationErrors>((acc, [field, messages]) => {
    if (messages && messages.length > 0) {
      acc[field] = messages
    }

    return acc
  }, {})
}

export function validate<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  input: unknown,
): ValidationResult<z.infer<TSchema>> {
  const parsed = schema.safeParse(input)

  if (parsed.success) {
    return {
      ok: true,
      data: parsed.data,
    }
  }

  const { fieldErrors, formErrors } = z.flattenError(parsed.error)

  return {
    ok: false,
    fieldErrors: normalizeErrors(fieldErrors),
    formErrors,
  }
}
