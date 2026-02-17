import type { ConsoleEntry } from '@/types/console'
import type { MouseEvent as ReactMouseEvent } from 'react'

type ConsolePanelProps = {
  logs: ConsoleEntry[]
  isRunning: boolean
  width: number
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}

const levelClassName: Record<ConsoleEntry['level'], string> = {
  log: 'text-slate-800',
  info: 'text-blue-700',
  warn: 'text-amber-700',
  error: 'text-rose-700',
  debug: 'text-violet-700',
}

export const ConsolePanel = ({ logs, isRunning, width, onResizeStart }: ConsolePanelProps) => {
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
        aria-label='콘솔 너비 조절 핸들'
        aria-orientation='vertical'
        aria-valuenow={width}
      />
      <header className='flex items-center justify-between border-b border-slate-200 px-3 py-2'>
        <h2 className='text-sm font-semibold text-slate-700'>Console</h2>
        <span className='text-xs text-slate-500' data-testid='running-indicator'>
          {isRunning ? 'Running...' : 'Idle'}
        </span>
      </header>

      <div className='min-h-0 flex-1 overflow-auto p-3 font-mono text-sm'>
        {logs.length === 0 ? (
          <p className='text-slate-500'>콘솔 출력이 없습니다.</p>
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
