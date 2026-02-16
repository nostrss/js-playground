import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initMonacoEnvironment } from './lib/monacoEnvironment'
import './index.css'
import App from './App.tsx'

initMonacoEnvironment()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
