export const themeIds = ['vs', 'dracula', 'vs-dark'] as const

export type MonacoThemeId = (typeof themeIds)[number]

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
