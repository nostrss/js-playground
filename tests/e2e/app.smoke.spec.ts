import { expect, test } from '@playwright/test'

test.describe('App smoke', () => {
  test('카운트 증가 버튼 클릭 시 값이 증가한다', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('0')).toBeVisible()

    await page.getByRole('button', { name: '카운트 증가' }).click()

    await expect(page.getByText('1')).toBeVisible()
  })

  test('키보드 Enter로 카운트를 증가시킨다', async ({ page }) => {
    await page.goto('/')

    const incrementButton = page.getByRole('button', { name: '카운트 증가' })
    await incrementButton.focus()
    await page.keyboard.press('Enter')

    await expect(page.getByText('1')).toBeVisible()
  })
})
