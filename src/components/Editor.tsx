import { useCodeRunner } from '@/hooks/useCodeRunner'
import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import { useEditorTheme } from '@/hooks/useEditorTheme'
import { useConsoleResize } from '@/hooks/useConsoleResize'
import { useShareCode } from '@/hooks/useShareCode'
import { MONACO_THEME_OPTIONS } from '@/constants/theme'
import { CODE_STORAGE_KEY, runtimeConfig } from '@/constants/editor'
import { getSharedCode } from '@/utils/share'
import { loadCode } from '@/utils/storage'

import { ConsolePanel } from './console'

export const Editor = () => {
  const initialCode = getSharedCode() ?? loadCode(CODE_STORAGE_KEY) ?? runtimeConfig.initialCode

  const { code, setCode, logs, isRunning } = useCodeRunner({
    debounceMs: runtimeConfig.debounceMs,
    clearOnRun: runtimeConfig.clearOnRun,
    initialCode,
  })
  const { containerRef } = useMonacoEditor({ initialCode, onCodeChange: setCode })
  const { selectedTheme, handleThemeChange } = useEditorTheme()
  const { consoleWidth, handleConsoleResizeStart } = useConsoleResize()
  const { share } = useShareCode(code)

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
          onShare={share}
        />
      </div>
    </div>
  )
}
