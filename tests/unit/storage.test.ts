import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadCode, saveCode } from '@/utils/storage'

const TEST_KEY = 'test:code'

describe('saveCode', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('코드를 지정한 키로 localStorage에 저장한다', () => {
    saveCode(TEST_KEY, 'console.log("hello")')

    expect(window.localStorage.getItem(TEST_KEY)).toBe('console.log("hello")')
  })

  it('빈 문자열도 저장한다', () => {
    saveCode(TEST_KEY, '')

    expect(window.localStorage.getItem(TEST_KEY)).toBe('')
  })

  it('localStorage가 throw해도 예외를 전파하지 않는다', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError')
    })

    expect(() => saveCode(TEST_KEY, 'code')).not.toThrow()
  })
})

describe('loadCode', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('저장된 코드를 반환한다', () => {
    window.localStorage.setItem(TEST_KEY, 'const x = 1')

    expect(loadCode(TEST_KEY)).toBe('const x = 1')
  })

  it('키가 없으면 null을 반환한다', () => {
    expect(loadCode(TEST_KEY)).toBeNull()
  })

  it('localStorage가 throw해도 null을 반환한다', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementationOnce(() => {
      throw new DOMException('SecurityError')
    })

    expect(loadCode(TEST_KEY)).toBeNull()
  })
})
