import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

export function initMonacoEnvironment() {
  if (window.__MONACO_ENV_INITIALIZED__) {
    return
  }

  window.MonacoEnvironment = {
    getWorker: (_workerId: string, label: string) => {
      if (label === 'typescript' || label === 'javascript') {
        return new TypeScriptWorker()
      }

      return new EditorWorker()
    },
  }

  window.__MONACO_ENV_INITIALIZED__ = true
}
