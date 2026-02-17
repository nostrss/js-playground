import { expect, test } from '@playwright/test'

test.describe('App playground', () => {
  test('콘솔 패널 너비를 드래그로 조절할 수 있다', async ({ page }) => {
    await page.goto('/')

    const consolePanel = page.getByTestId('console-panel')
    const resizeHandle = page.getByTestId('console-resize-handle')

    await expect(consolePanel).toHaveCSS('width', '360px')

    const handleBox = await resizeHandle.boundingBox()
    if (!handleBox) {
      throw new Error('콘솔 리사이즈 핸들 위치를 가져올 수 없습니다.')
    }

    const startX = handleBox.x + handleBox.width / 2
    const startY = handleBox.y + handleBox.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - 120, startY)
    await page.mouse.up()

    await expect
      .poll(async () =>
        Number.parseFloat(
          await consolePanel.evaluate((element) => window.getComputedStyle(element).width),
        ),
      )
      .toBeGreaterThan(460)
  })

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
