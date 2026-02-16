import { expect, test } from '@playwright/test'

test.describe('App playground', () => {
  test('초기 코드 실행 결과가 콘솔에 출력된다', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('console-panel')).toContainText('Hello world!')
  })

  test('코드 변경 시 자동 실행되고 runtime error가 출력된다', async ({ page }) => {
    await page.goto('/')

    const consolePanel = page.getByTestId('console-panel')
    const inputArea = page.locator('.monaco-editor textarea.inputarea').first()

    await inputArea.click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.type("console.log('e2e message')")

    await expect(consolePanel).toContainText('e2e message')
    await expect(consolePanel).not.toContainText('Hello world!')

    await inputArea.click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.type("throw new Error('boom from e2e')")

    await expect(consolePanel).toContainText('boom from e2e')
    await expect(consolePanel).not.toContainText('e2e message')
  })
})
