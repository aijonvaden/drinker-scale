import { test, expect } from '@playwright/test'

test('result renders fully under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?b=10&h=4')
  await expect(page.getByRole('heading', { name: 'Rick Blaine' })).toBeVisible()
  await expect(page.locator('.percentile-bar .bar-fill')).toBeVisible()
  await expect(page.locator('.stats-strip .stat-val').first()).toContainText('10')
})
