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
          await consolePanel.evaluate(
            element => window.getComputedStyle(element).width,
          ),
        ),
      )
      .toBeGreaterThan(460)
  })

  test('초기 코드 실행 결과가 콘솔에 출력된다', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('console-panel')).toContainText(
      'Hello world!',
    )
  })

  test('최초 접속 시 default 테마(vs)가 렌더링 된다', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('editor-theme-select')).toHaveValue('vs')

    await expect(page.getByTestId('console-panel')).toHaveCSS(
      'background-color',
      'rgb(248, 250, 252)',
    )
  })

  test('Dracula 테마로 변경하면 콘솔 패널 스타일이 즉시 반영된다', async ({ page }) => {
    await page.goto('/')

    const themeSelect = page.getByTestId('editor-theme-select')
    await themeSelect.selectOption('dracula')

    await expect(themeSelect).toHaveValue('dracula')

    await expect(page.getByTestId('console-panel')).toHaveCSS(
      'background-color',
      'rgb(45, 49, 64)',
    )
  })

  test('콘솔 레벨별(log/info/warn/error) 출력과 색상이 올바르게 렌더링된다', async ({ page }) => {
    await page.goto('/')

    await page.locator('.monaco-editor').first().click()
    await page.keyboard.press('Control+a')
    await page.keyboard.press('Delete')
    await page.keyboard.type([
      'console.log("log message")',
      'console.info("info message")',
      'console.warn("warn message")',
      'console.error("error message")',
    ].join('\n'))

    await page.waitForTimeout(1500)

    const consolePanel = page.getByTestId('console-panel')

    await expect(consolePanel).toContainText('log message')
    await expect(consolePanel).toContainText('info message')
    await expect(consolePanel).toContainText('warn message')
    await expect(consolePanel).toContainText('error message')

    const logEntry = page.locator('[data-testid="console-log-entry"][data-level="log"]').first()
    const infoEntry = page.locator('[data-testid="console-log-entry"][data-level="info"]').first()
    const warnEntry = page.locator('[data-testid="console-log-entry"][data-level="warn"]').first()
    const errorEntry = page.locator('[data-testid="console-log-entry"][data-level="error"]').first()

    await expect(logEntry).toHaveCSS('color', 'rgb(51, 65, 85)')
    await expect(infoEntry).toHaveCSS('color', 'rgb(29, 78, 216)')
    await expect(warnEntry).toHaveCSS('color', 'rgb(180, 83, 9)')
    await expect(errorEntry).toHaveCSS('color', 'rgb(190, 18, 60)')
  })
})
