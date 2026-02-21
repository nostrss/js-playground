import { afterEach, describe, expect, it } from 'vitest'

import { buildShareUrl, decodeCode, encodeCode, getSharedCode } from '@/utils/share'

describe('encodeCode / decodeCode', () => {
  it('인코딩 후 디코딩하면 원본 코드를 반환한다', () => {
    const code = 'console.log("hello, world!")'
    expect(decodeCode(encodeCode(code))).toBe(code)
  })

  it('빈 문자열을 디코딩하면 null을 반환한다', () => {
    expect(decodeCode('')).toBeNull()
  })

  it('멀티라인 코드도 라운드트립이 성공한다', () => {
    const code = 'const a = 1\nconst b = 2\nconsole.log(a + b)'
    expect(decodeCode(encodeCode(code))).toBe(code)
  })
})

describe('buildShareUrl', () => {
  it('현재 URL에 #code= 해시가 포함된 URL을 반환한다', () => {
    const url = buildShareUrl('console.log("hello")')
    expect(url).toMatch(/^http:\/\/localhost(:\d+)?\/#code=.+$/)
  })

  it('반환된 URL을 getSharedCode로 디코딩하면 원본 코드가 나온다', () => {
    const code = 'console.log("share test")'
    const url = buildShareUrl(code)
    const hash = new URL(url).hash
    window.location.hash = hash
    expect(getSharedCode()).toBe(code)
    window.location.hash = ''
  })
})

describe('getSharedCode', () => {
  afterEach(() => {
    window.location.hash = ''
  })

  it('해시에 코드가 있으면 디코딩된 코드를 반환한다', () => {
    const code = 'console.log("from hash")'
    window.location.hash = `code=${encodeCode(code)}`
    expect(getSharedCode()).toBe(code)
  })

  it('해시가 없으면 null을 반환한다', () => {
    expect(getSharedCode()).toBeNull()
  })

  it('#code= prefix가 없으면 null을 반환한다', () => {
    window.location.hash = 'other=something'
    expect(getSharedCode()).toBeNull()
  })

  it('#code= 이후 값이 비어있으면 null을 반환한다', () => {
    window.location.hash = 'code='
    expect(getSharedCode()).toBeNull()
  })
})
