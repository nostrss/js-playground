import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/editor/editor.main.js'

import { registerThemes } from '@/utils/theme'

type UseMonacoEditorOptions = {
  initialCode: string
  onCodeChange: (code: string) => void
}

export function useMonacoEditor({ initialCode, onCodeChange }: UseMonacoEditorOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    registerThemes(monaco)

    const editorInstance = monaco.editor.create(containerRef.current, {
      value: initialCode,
      language: 'javascript',
      automaticLayout: true,
      minimap: { enabled: false },
    })

    const contentListener = editorInstance.onDidChangeModelContent(() => {
      onCodeChange(editorInstance.getValue())
    })

    return () => {
      contentListener.dispose()
      editorInstance.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef }
}
