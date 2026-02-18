import type { ConsoleEntry } from '@/types/console'
import type { ConsolePanelThemeStyle } from '@/types/theme'

type LogListProps = {
  logs: ConsoleEntry[]
  themeStyle: ConsolePanelThemeStyle
}

export const LogList = ({ logs, themeStyle }: LogListProps) => {
  const levelStyle: Record<ConsoleEntry['level'], { color: string }> = {
    log: { color: themeStyle.bodyText },
    info: { color: themeStyle.levelInfoText },
    warn: { color: themeStyle.levelWarnText },
    error: { color: themeStyle.levelErrorText },
    debug: { color: themeStyle.levelDebugText },
  }

  return (
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
  )
}
