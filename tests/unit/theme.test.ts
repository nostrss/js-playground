import { describe, expect, it } from 'vitest'

import { getThemeStyle, isThemeId, resolveTheme } from '@/utils/theme'

describe('theme utils', () => {
  describe('getThemeStyle', () => {
    it('dracula 패널 배경은 에디터 배경과 동일하지 않다', () => {
      const draculaStyle = getThemeStyle('dracula')

      expect(draculaStyle.panelBg.toLowerCase()).not.toBe('#282a36')
    })

    it('각 테마별 패널 스타일을 반환한다', () => {
      const vsStyle = getThemeStyle('vs')
      const draculaStyle = getThemeStyle('dracula')
      const vsDarkStyle = getThemeStyle('vs-dark')

      expect(vsStyle.panelBg).toBeTruthy()
      expect(draculaStyle.panelBg).toBeTruthy()
      expect(vsDarkStyle.panelBg).toBeTruthy()
      expect(vsStyle.panelBg).not.toBe(vsDarkStyle.panelBg)
    })
  })

  describe('isThemeId', () => {
    it('유효한 테마 ID를 true로 반환한다', () => {
      expect(isThemeId('vs')).toBe(true)
      expect(isThemeId('dracula')).toBe(true)
      expect(isThemeId('vs-dark')).toBe(true)
    })

    it('무효한 테마 ID를 false로 반환한다', () => {
      expect(isThemeId('invalid')).toBe(false)
      expect(isThemeId('')).toBe(false)
      expect(isThemeId('VS')).toBe(false)
    })
  })

  describe('resolveTheme', () => {
    it('null 입력 시 기본 테마를 반환한다', () => {
      expect(resolveTheme(null)).toBe('vs')
    })

    it('빈 문자열 입력 시 기본 테마를 반환한다', () => {
      expect(resolveTheme('')).toBe('vs')
    })

    it('무효한 값 입력 시 기본 테마를 반환한다', () => {
      expect(resolveTheme('invalid-theme')).toBe('vs')
    })

    it('유효한 테마 ID를 그대로 반환한다', () => {
      expect(resolveTheme('dracula')).toBe('dracula')
      expect(resolveTheme('vs-dark')).toBe('vs-dark')
      expect(resolveTheme('vs')).toBe('vs')
    })
  })
})
