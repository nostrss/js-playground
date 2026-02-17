import type * as monaco from 'monaco-editor'

export const themeIds = ['vs', 'dracula', 'vs-dark'] as const

export type MonacoThemeId = (typeof themeIds)[number]

export const DEFAULT_THEME_ID: MonacoThemeId = 'vs'

export const THEME_STORAGE_KEY = 'playground:editor-theme'

export const MONACO_THEME_OPTIONS: Array<{ id: MonacoThemeId; label: string }> = [
  { id: 'vs', label: 'Default' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'vs-dark', label: 'VS Dark' },
]

const draculaThemeData: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
    { token: 'string', foreground: 'F1FA8C' },
    { token: 'number', foreground: 'BD93F9' },
    { token: 'keyword', foreground: 'FF79C6' },
    { token: 'type.identifier', foreground: '8BE9FD' },
    { token: 'delimiter.bracket', foreground: 'F8F8F2' },
  ],
  colors: {
    'editor.background': '#282A36',
    'editor.foreground': '#F8F8F2',
    'editorLineNumber.foreground': '#6272A4',
    'editorLineNumber.activeForeground': '#F8F8F2',
    'editorCursor.foreground': '#F8F8F2',
    'editor.selectionBackground': '#44475A',
    'editor.inactiveSelectionBackground': '#3A3D4D',
    'editorIndentGuide.background1': '#44475A',
    'editorIndentGuide.activeBackground1': '#6272A4',
  },
}

export function isMonacoThemeId(value: string): value is MonacoThemeId {
  return themeIds.includes(value as MonacoThemeId)
}

export function resolveStoredTheme(rawValue: string | null): MonacoThemeId {
  if (!rawValue || !isMonacoThemeId(rawValue)) {
    return DEFAULT_THEME_ID
  }

  return rawValue
}

export function registerMonacoThemes(monacoInstance: typeof monaco) {
  monacoInstance.editor.defineTheme('dracula', draculaThemeData)
}
