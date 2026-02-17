import type { ConsoleEntry } from '@/types/console'
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react'
import { getConsolePanelThemeStyle, type MonacoThemeId } from '@/lib/monacoThemes'

type ConsolePanelProps = {
  logs: ConsoleEntry[]
  isRunning: boolean
  width: number
  selectedTheme: MonacoThemeId
  themeOptions: Array<{ id: MonacoThemeId; label: string }>
  onThemeChange: (themeId: MonacoThemeId) => void
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}

export const ConsolePanel = ({
  logs,
  isRunning,
  width,
  selectedTheme,
  themeOptions,
  onThemeChange,
  onResizeStart,
}: ConsolePanelProps) => {
  const themeStyle = getConsolePanelThemeStyle(selectedTheme)

  const levelStyle: Record<ConsoleEntry['level'], { color: string }> = {
    log: { color: themeStyle.bodyText },
    info: { color: themeStyle.levelInfoText },
    warn: { color: themeStyle.levelWarnText },
    error: { color: themeStyle.levelErrorText },
    debug: { color: themeStyle.levelDebugText },
  }

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value as MonacoThemeId)
  }

  return (
    <section
      className='relative flex h-full min-w-0 shrink-0 flex-col border-l'
      data-testid='console-panel'
      style={{
        width: `${width}px`,
        backgroundColor: themeStyle.panelBg,
        borderColor: themeStyle.panelBorder,
      }}
    >
      <div
        className='absolute inset-y-0 left-0 z-10 w-2 -translate-x-1/2 cursor-col-resize select-none'
        data-testid='console-resize-handle'
        onMouseDown={onResizeStart}
        role='separator'
        aria-label='Console resize handle'
        aria-orientation='vertical'
        aria-valuenow={width}
      />
      <header
        className='flex items-center justify-between border-b px-3 py-2'
        style={{ borderColor: themeStyle.headerBorder }}
      >
        <h2 className='text-sm font-semibold' style={{ color: themeStyle.titleText }}>
          Console
        </h2>
        <div className='flex items-center gap-2'>
          <label htmlFor='editor-theme-select' className='sr-only'>
            Editor theme
          </label>
          <select
            id='editor-theme-select'
            data-testid='editor-theme-select'
            className='rounded border px-2 py-1 text-xs'
            value={selectedTheme}
            onChange={handleThemeChange}
            style={{
              backgroundColor: themeStyle.selectBg,
              borderColor: themeStyle.selectBorder,
              color: themeStyle.selectText,
            }}
          >
            {themeOptions.map((themeOption) => (
              <option key={themeOption.id} value={themeOption.id}>
                {themeOption.label}
              </option>
            ))}
          </select>
          <span className='text-xs' data-testid='running-indicator' style={{ color: themeStyle.metaText }}>
            {isRunning ? 'Running...' : 'Idle'}
          </span>
        </div>
      </header>

      <div className='min-h-0 flex-1 overflow-auto p-3 font-mono text-sm' style={{ color: themeStyle.bodyText }}>
        {logs.length === 0 ? (
          <p style={{ color: themeStyle.emptyText }}>No console output.</p>
        ) : (
          <ul className='space-y-2'>
            {logs.map((log) => (
              <li key={log.id} style={levelStyle[log.level]}>
                <span className='mr-2 text-xs uppercase opacity-70'>{log.level}</span>
                <span>{log.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
