import { GA_SCRIPT_ID } from '@/constants/analytics'

let initialized = false
let configured = false

function getMeasurementId(): string | null {
  const value = import.meta.env.VITE_GA_MEASUREMENT_ID

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isAnalyticsEnabled() {
  if (import.meta.env.DEV) {
    return false
  }

  return getMeasurementId() !== null
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer ?? []

  if (typeof window.gtag === 'function') {
    return
  }

  window.gtag = ((...args: unknown[]) => {
    window.dataLayer?.push(args)
  }) as Gtag
}

function getGtag(): Gtag | null {
  return typeof window.gtag === 'function' ? window.gtag : null
}

export function initAnalytics() {
  if (typeof window === 'undefined' || initialized || !isAnalyticsEnabled()) {
    return
  }

  initialized = true

  const measurementId = getMeasurementId()
  if (!measurementId) {
    return
  }

  ensureGtagStub()

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = GA_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  const gtag = getGtag()
  if (!gtag || configured) {
    return
  }

  gtag('js', new Date())
  gtag('config', measurementId, { send_page_view: false })
  configured = true
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled()) {
    return
  }

  const measurementId = getMeasurementId()
  const gtag = getGtag()

  if (!measurementId || !gtag) {
    return
  }

  gtag('event', 'page_view', {
    page_path: path,
  })
}

export function trackEvent(eventName: string, params?: GtagParams) {
  if (!isAnalyticsEnabled()) {
    return
  }

  const gtag = getGtag()
  if (!gtag) {
    return
  }

  gtag('event', eventName, params)
}
