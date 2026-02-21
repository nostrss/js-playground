import { expect, test } from '@playwright/test'

async function mockClipboard(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    })
  })
}

test.describe('Share 기능', () => {
  test('Share 버튼 클릭 시 복사 완료 alert가 노출된다', async ({ page }) => {
    await mockClipboard(page)
    await page.goto('/')

    const dialogPromise = page.waitForEvent('dialog')
    // alert()가 발생하면 click()이 블로킹되므로 await 없이 실행
    void page.getByRole('button', { name: 'Share' }).click()

    const dialog = await dialogPromise
    expect(dialog.message()).toBe('링크가 클립보드에 복사되었습니다!')
    await dialog.accept()
  })

  test('alert 수락 후 Share 버튼 텍스트는 그대로 "Share"다', async ({ page }) => {
    await mockClipboard(page)
    await page.goto('/')

    const dialogPromise = page.waitForEvent('dialog')
    void page.getByRole('button', { name: 'Share' }).click()
    const dialog = await dialogPromise
    await dialog.accept()

    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Share' })).toHaveText('Share')
  })
})
