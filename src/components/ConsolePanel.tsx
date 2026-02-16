import type { ConsoleEntry } from '@/types/console'

type ConsolePanelProps = {
  logs: ConsoleEntry[]
  isRunning: boolean
}

const levelClassName: Record<ConsoleEntry['level'], string> = {
  log: 'text-slate-800',
  info: 'text-blue-700',
  warn: 'text-amber-700',
  error: 'text-rose-700',
  debug: 'text-violet-700',
}

export const ConsolePanel = ({ logs, isRunning }: ConsolePanelProps) => {
  return (
    <section className='flex h-full min-w-0 flex-col border-l border-slate-200 bg-slate-50' data-testid='console-panel'>
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
