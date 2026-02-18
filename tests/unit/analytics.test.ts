import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GA_SCRIPT_ID } from '@/constants/analytics'

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules()
    document.getElementById(GA_SCRIPT_ID)?.remove()
    delete window.gtag
    delete (window as Record<string, unknown>).dataLayer
  })

  afterEach(() => {
    document.getElementById(GA_SCRIPT_ID)?.remove()
    delete window.gtag
    delete (window as Record<string, unknown>).dataLayer
  })

  it('DEV 모드에서 GA4 스크립트를 삽입하지 않는다', async () => {
    vi.stubEnv('DEV', true)
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123')

    const { initAnalytics } = await import('@/lib/analytics')
    initAnalytics()

    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull()

    vi.unstubAllEnvs()
  })

  it('measurement ID 미설정 시 GA4 스크립트를 삽입하지 않는다', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '')

    const { initAnalytics } = await import('@/lib/analytics')
    initAnalytics()

    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull()

    vi.unstubAllEnvs()
  })

  it('프로덕션 + 유효 ID 시 GA4 스크립트를 삽입한다', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-VALID123')

    const { initAnalytics } = await import('@/lib/analytics')
    initAnalytics()

    const script = document.getElementById(GA_SCRIPT_ID)
    expect(script).not.toBeNull()
    expect(script?.tagName).toBe('SCRIPT')

    vi.unstubAllEnvs()
  })
})
