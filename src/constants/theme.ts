import type * as monaco from 'monaco-editor'

import type { ConsolePanelThemeStyle, MonacoThemeId } from '@/types/theme'

export const DEFAULT_THEME_ID: MonacoThemeId = 'vs'

export const THEME_STORAGE_KEY = 'playground:editor-theme'

export const MONACO_THEME_OPTIONS: Array<{ id: MonacoThemeId; label: string }> = [
  { id: 'vs', label: 'Default' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'vs-dark', label: 'VS Dark' },
]

const palette = {
  dracula: { bg: '#282A36', fg: '#F8F8F2', comment: '#6272A4', string: '#F1FA8C', number: '#BD93F9', keyword: '#FF79C6', type: '#8BE9FD', selection: '#44475A', inactiveSelection: '#3A3D4D' },
  light: { surface: '#F8FAFC', border: '#E2E8F0', text: '#334155', muted: '#64748B', white: '#FFFFFF', selectBorder: '#CBD5E1', info: '#1D4ED8', warn: '#B45309', error: '#BE123C', debug: '#6D28D9' },
  draculaPanel: { surface: '#2D3140', border: '#3A4153', text: '#E2E8F0', muted: '#B7C0D6', selectBg: '#353A4C', selectBorder: '#4A5368', info: '#8BE9FD', warn: '#F1FA8C', error: '#FF9580', debug: '#C4B5FD' },
  dark: { surface: '#1F232B', border: '#2B313B', text: '#D2D8E1', muted: '#A2ACB9', selectBg: '#262C35', selectBorder: '#3B4553', info: '#93C5FD', warn: '#FCD34D', error: '#FDA4AF', debug: '#C4B5FD' },
} as const

export const draculaThemeData: monaco.editor.IStandaloneThemeData = {
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
    'editor.background': palette.dracula.bg,
    'editor.foreground': palette.dracula.fg,
    'editorLineNumber.foreground': palette.dracula.comment,
    'editorLineNumber.activeForeground': palette.dracula.fg,
    'editorCursor.foreground': palette.dracula.fg,
    'editor.selectionBackground': palette.dracula.selection,
    'editor.inactiveSelectionBackground': palette.dracula.inactiveSelection,
    'editorIndentGuide.background1': palette.dracula.selection,
    'editorIndentGuide.activeBackground1': palette.dracula.comment,
  },
}

export const consolePanelThemeStyles: Record<MonacoThemeId, ConsolePanelThemeStyle> = {
  vs: {
    panelBg: palette.light.surface,
    panelBorder: palette.light.border,
    headerBorder: palette.light.border,
    titleText: palette.light.text,
    metaText: palette.light.muted,
    bodyText: palette.light.text,
    emptyText: palette.light.muted,
    selectBg: palette.light.white,
    selectBorder: palette.light.selectBorder,
    selectText: palette.light.text,
    levelInfoText: palette.light.info,
    levelWarnText: palette.light.warn,
    levelErrorText: palette.light.error,
    levelDebugText: palette.light.debug,
  },
  dracula: {
    panelBg: palette.draculaPanel.surface,
    panelBorder: palette.draculaPanel.border,
    headerBorder: palette.draculaPanel.border,
    titleText: palette.draculaPanel.text,
    metaText: palette.draculaPanel.muted,
    bodyText: palette.draculaPanel.text,
    emptyText: palette.draculaPanel.muted,
    selectBg: palette.draculaPanel.selectBg,
    selectBorder: palette.draculaPanel.selectBorder,
    selectText: palette.draculaPanel.text,
    levelInfoText: palette.draculaPanel.info,
    levelWarnText: palette.draculaPanel.warn,
    levelErrorText: palette.draculaPanel.error,
    levelDebugText: palette.draculaPanel.debug,
  },
  'vs-dark': {
    panelBg: palette.dark.surface,
    panelBorder: palette.dark.border,
    headerBorder: palette.dark.border,
    titleText: palette.dark.text,
    metaText: palette.dark.muted,
    bodyText: palette.dark.text,
    emptyText: palette.dark.muted,
    selectBg: palette.dark.selectBg,
    selectBorder: palette.dark.selectBorder,
    selectText: palette.dark.text,
    levelInfoText: palette.dark.info,
    levelWarnText: palette.dark.warn,
    levelErrorText: palette.dark.error,
    levelDebugText: palette.dark.debug,
  },
}
