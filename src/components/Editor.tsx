import { useCodeRunner } from '@/hooks/useCodeRunner'
import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import { useEditorTheme } from '@/hooks/useEditorTheme'
import { useConsoleResize } from '@/hooks/useConsoleResize'
import { MONACO_THEME_OPTIONS } from '@/constants/theme'
import { runtimeConfig } from '@/constants/editor'

import { ConsolePanel } from './console'

export const Editor = () => {
  const { setCode, logs, isRunning } = useCodeRunner({
    debounceMs: runtimeConfig.debounceMs,
    clearOnRun: runtimeConfig.clearOnRun,
    initialCode: runtimeConfig.initialCode,
  })
  const { containerRef } = useMonacoEditor({ initialCode: runtimeConfig.initialCode, onCodeChange: setCode })
  const { selectedTheme, handleThemeChange } = useEditorTheme()
  const { consoleWidth, handleConsoleResizeStart } = useConsoleResize()

  return (
    <div className='h-full w-full overflow-auto'>
      <div className='flex h-full min-w-[960px]' data-testid='playground-layout'>
        <section className='h-full min-w-0 flex-1' data-testid='editor-panel'>
          <div ref={containerRef} className='h-full w-full' />
        </section>
        <ConsolePanel
          logs={logs}
          isRunning={isRunning}
          width={consoleWidth}
          selectedTheme={selectedTheme}
          themeOptions={MONACO_THEME_OPTIONS}
          onThemeChange={handleThemeChange}
          onResizeStart={handleConsoleResizeStart}
        />
      </div>
    </div>
  )
}
