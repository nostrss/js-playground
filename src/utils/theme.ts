import type * as monaco from 'monaco-editor'

import { themeIds, type MonacoThemeId, type ConsolePanelThemeStyle } from '@/types/theme'
import { DEFAULT_THEME_ID, draculaThemeData, consolePanelThemeStyles } from '@/constants/theme'

export function isThemeId(value: string): value is MonacoThemeId {
  return themeIds.includes(value as MonacoThemeId)
}

export function resolveTheme(rawValue: string | null): MonacoThemeId {
  if (!rawValue || !isThemeId(rawValue)) {
    return DEFAULT_THEME_ID
  }

  return rawValue
}

export function registerThemes(monacoInstance: typeof monaco) {
  monacoInstance.editor.defineTheme('dracula', draculaThemeData)
}

export function getThemeStyle(themeId: MonacoThemeId): ConsolePanelThemeStyle {
  return consolePanelThemeStyles[themeId]
}
