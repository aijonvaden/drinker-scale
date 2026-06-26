import { test } from '@playwright/test'

const WIDTHS = [375, 768, 1280, 1440]

test.describe('responsive screenshots', () => {
  for (const w of WIDTHS) {
    test(`home @ ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 })
      await page.goto('/')
      await page.waitForTimeout(400)
      await page.screenshot({ path: `tests/e2e/__shots__/home-${w}.png`, fullPage: true })
    })

    test(`result @ ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 })
      await page.goto('/?b=10&s=2&w=1&c=3&h=5')
      await page.waitForTimeout(700)
      await page.screenshot({ path: `tests/e2e/__shots__/result-${w}.png`, fullPage: true })
    })

    test(`hall @ ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 })
      await page.goto('/')
      await page.getByRole('button', { name: /Enter the Hall of Legends/i }).click()
      await page.waitForTimeout(900)
      await page.screenshot({ path: `tests/e2e/__shots__/hall-${w}.png`, fullPage: true })
    })
  }
})
