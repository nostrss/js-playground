import { useCallback, useEffect, useState } from 'react'
import * as monaco from 'monaco-editor'

import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from '@/constants/theme'
import type { MonacoThemeId } from '@/types/theme'
import { resolveTheme } from '@/utils/theme'
import { trackEvent } from '@/lib/analytics'

export function useEditorTheme() {
  const [selectedTheme, setSelectedTheme] = useState<MonacoThemeId>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME_ID
    }

    return resolveTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
  })

  useEffect(() => {
    monaco.editor.setTheme(selectedTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme)
  }, [selectedTheme])

  const handleThemeChange = useCallback((nextTheme: MonacoThemeId) => {
    setSelectedTheme(nextTheme)
    trackEvent('theme_change', {
      source: 'console-panel',
      theme: nextTheme,
    })
  }, [])

  return { selectedTheme, handleThemeChange }
}
