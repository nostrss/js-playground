import type { MouseEvent as ReactMouseEvent } from 'react'

import type { ConsoleEntry } from '@/types/console'
import type { MonacoThemeId } from '@/types/theme'
import { getThemeStyle } from '@/utils/theme'

import { ResizeHandle } from './ResizeHandle'
import { ConsoleHeader } from './ConsoleHeader'
import { LogList } from './LogList'

type ConsolePanelProps = {
  logs: ConsoleEntry[]
  isRunning: boolean
  width: number
  selectedTheme: MonacoThemeId
  themeOptions: Array<{ id: MonacoThemeId; label: string }>
  onThemeChange: (themeId: MonacoThemeId) => void
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
  onShare: () => void
}

export const ConsolePanel = ({
  logs,
  isRunning,
  width,
  selectedTheme,
  themeOptions,
  onThemeChange,
  onResizeStart,
  onShare,
}: ConsolePanelProps) => {
  const themeStyle = getThemeStyle(selectedTheme)

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
      <ResizeHandle width={width} onResizeStart={onResizeStart} />
      <ConsoleHeader
        isRunning={isRunning}
        selectedTheme={selectedTheme}
        themeOptions={themeOptions}
        themeStyle={themeStyle}
        onThemeChange={onThemeChange}
        onShare={onShare}
      />
      <LogList logs={logs} themeStyle={themeStyle} />
    </section>
  )
}
