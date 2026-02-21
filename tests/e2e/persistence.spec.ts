import { expect, test } from '@playwright/test'

const CODE_STORAGE_KEY = 'playground:editor-code'

test.describe('코드 localStorage 영속성', () => {
  test('localStorage에 저장된 코드로 페이지가 초기화된다', async ({ page }) => {
    await page.addInitScript(({ key }) => {
      window.localStorage.setItem(key, 'console.log("restored")')
    }, { key: CODE_STORAGE_KEY })

    await page.goto('/')

    await expect(page.getByTestId('console-panel')).toContainText('restored', { timeout: 5000 })
  })

  test('localStorage가 비어있으면 기본 코드(Hello world!)로 시작한다', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('console-panel')).toContainText('Hello world!', { timeout: 5000 })
  })
})
