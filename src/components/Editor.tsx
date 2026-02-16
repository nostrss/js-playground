import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import 'monaco-editor/min/vs/editor/editor.main.css'

export const Editor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const editorInstance = monaco.editor.create(containerRef.current, {
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
      language: 'javascript',
      automaticLayout: true,
    })

    return () => {
      editorInstance.dispose()
    }
  }, [])

  return <div ref={containerRef} className='h-full w-full' />
}
