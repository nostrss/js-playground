import type { ConsoleEntry } from '@/types/console'
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react'
import type { MonacoThemeId } from '@/lib/monacoThemes'

type ConsolePanelProps = {
  logs: ConsoleEntry[]
  isRunning: boolean
  width: number
  selectedTheme: MonacoThemeId
  themeOptions: Array<{ id: MonacoThemeId; label: string }>
  onThemeChange: (themeId: MonacoThemeId) => void
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}

const levelClassName: Record<ConsoleEntry['level'], string> = {
  log: 'text-slate-800',
  info: 'text-blue-700',
  warn: 'text-amber-700',
  error: 'text-rose-700',
  debug: 'text-violet-700',
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
  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value as MonacoThemeId)
  }

  return (
    <section
      className='relative flex h-full min-w-0 shrink-0 flex-col border-l border-slate-200 bg-slate-50'
      data-testid='console-panel'
      style={{ width: `${width}px` }}
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
      <header className='flex items-center justify-between border-b border-slate-200 px-3 py-2'>
        <h2 className='text-sm font-semibold text-slate-700'>Console</h2>
        <div className='flex items-center gap-2'>
          <label htmlFor='editor-theme-select' className='sr-only'>
            Editor theme
          </label>
          <select
            id='editor-theme-select'
            data-testid='editor-theme-select'
            className='rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700'
            value={selectedTheme}
            onChange={handleThemeChange}
          >
            {themeOptions.map((themeOption) => (
              <option key={themeOption.id} value={themeOption.id}>
                {themeOption.label}
              </option>
            ))}
          </select>
          <span className='text-xs text-slate-500' data-testid='running-indicator'>
            {isRunning ? 'Running...' : 'Idle'}
          </span>
        </div>
      </header>

      <div className='min-h-0 flex-1 overflow-auto p-3 font-mono text-sm'>
        {logs.length === 0 ? (
          <p className='text-slate-500'>No console output.</p>
        ) : (
          <ul className='space-y-2'>
            {logs.map((log) => (
              <li key={log.id} className={levelClassName[log.level]}>
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
