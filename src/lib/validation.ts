import { z } from 'zod'

export type ValidationErrors = Record<string, string[]>

export type ValidationSuccess<T> = {
  ok: true
  data: T
}

export type ValidationFailure = {
  ok: false
  fieldErrors: ValidationErrors
  formErrors: string[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

function normalizeFieldErrors(
  rawFieldErrors: Record<string, string[] | undefined>,
): ValidationErrors {
  return Object.entries(rawFieldErrors).reduce<ValidationErrors>((acc, [field, messages]) => {
    if (messages && messages.length > 0) {
      acc[field] = messages
    }

    return acc
  }, {})
}

export function validateWithSchema<TSchema extends z.ZodTypeAny>(
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
    fieldErrors: normalizeFieldErrors(fieldErrors),
    formErrors,
  }
}
