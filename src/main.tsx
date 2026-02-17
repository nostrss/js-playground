import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics, trackPageView } from './lib/analytics'
import { initMonacoEnvironment } from './lib/monacoEnvironment'
import './index.css'
import App from './App.tsx'

initMonacoEnvironment()
initAnalytics()
trackPageView(window.location.pathname + window.location.search)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
