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

export type ConsolePanelThemeStyle = {
  panelBg: string
  panelBorder: string
  headerBorder: string
  titleText: string
  metaText: string
  bodyText: string
  emptyText: string
  selectBg: string
  selectBorder: string
  selectText: string
  levelInfoText: string
  levelWarnText: string
  levelErrorText: string
  levelDebugText: string
}

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

const consolePanelThemeStyles: Record<MonacoThemeId, ConsolePanelThemeStyle> = {
  vs: {
    panelBg: '#F8FAFC',
    panelBorder: '#E2E8F0',
    headerBorder: '#E2E8F0',
    titleText: '#334155',
    metaText: '#64748B',
    bodyText: '#334155',
    emptyText: '#64748B',
    selectBg: '#FFFFFF',
    selectBorder: '#CBD5E1',
    selectText: '#334155',
    levelInfoText: '#1D4ED8',
    levelWarnText: '#B45309',
    levelErrorText: '#BE123C',
    levelDebugText: '#6D28D9',
  },
  dracula: {
    panelBg: '#2D3140',
    panelBorder: '#3A4153',
    headerBorder: '#3A4153',
    titleText: '#E2E8F0',
    metaText: '#B7C0D6',
    bodyText: '#E2E8F0',
    emptyText: '#B7C0D6',
    selectBg: '#353A4C',
    selectBorder: '#4A5368',
    selectText: '#E2E8F0',
    levelInfoText: '#8BE9FD',
    levelWarnText: '#F1FA8C',
    levelErrorText: '#FF9580',
    levelDebugText: '#C4B5FD',
  },
  'vs-dark': {
    panelBg: '#1F232B',
    panelBorder: '#2B313B',
    headerBorder: '#2B313B',
    titleText: '#D2D8E1',
    metaText: '#A2ACB9',
    bodyText: '#D2D8E1',
    emptyText: '#A2ACB9',
    selectBg: '#262C35',
    selectBorder: '#3B4553',
    selectText: '#D2D8E1',
    levelInfoText: '#93C5FD',
    levelWarnText: '#FCD34D',
    levelErrorText: '#FDA4AF',
    levelDebugText: '#C4B5FD',
  },
}

export function getConsolePanelThemeStyle(themeId: MonacoThemeId): ConsolePanelThemeStyle {
  return consolePanelThemeStyles[themeId]
}
