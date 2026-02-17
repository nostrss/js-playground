import { describe, expect, it } from 'vitest'

import { getConsolePanelThemeStyle } from '@/lib/monacoThemes'

describe('monaco themes', () => {
  it('dracula 패널 배경은 에디터 배경과 동일하지 않다', () => {
    const draculaStyle = getConsolePanelThemeStyle('dracula')

    expect(draculaStyle.panelBg.toLowerCase()).not.toBe('#282a36')
  })

  it('각 테마별 패널 스타일을 반환한다', () => {
    const vsStyle = getConsolePanelThemeStyle('vs')
    const draculaStyle = getConsolePanelThemeStyle('dracula')
    const vsDarkStyle = getConsolePanelThemeStyle('vs-dark')

    expect(vsStyle.panelBg).toBeTruthy()
    expect(draculaStyle.panelBg).toBeTruthy()
    expect(vsDarkStyle.panelBg).toBeTruthy()
    expect(vsStyle.panelBg).not.toBe(vsDarkStyle.panelBg)
  })
})
