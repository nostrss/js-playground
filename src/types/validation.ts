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
