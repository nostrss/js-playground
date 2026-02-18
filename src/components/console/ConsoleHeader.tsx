import type { ChangeEvent } from 'react'

import type { MonacoThemeId } from '@/types/theme'
import type { ConsolePanelThemeStyle } from '@/types/theme'

type ConsoleHeaderProps = {
  isRunning: boolean
  selectedTheme: MonacoThemeId
  themeOptions: Array<{ id: MonacoThemeId; label: string }>
  themeStyle: ConsolePanelThemeStyle
  onThemeChange: (themeId: MonacoThemeId) => void
}

export const ConsoleHeader = ({
  isRunning,
  selectedTheme,
  themeOptions,
  themeStyle,
  onThemeChange,
}: ConsoleHeaderProps) => {
  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value as MonacoThemeId)
  }

  return (
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
  )
}
