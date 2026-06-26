import { test, expect } from '@playwright/test'

test('a share URL reproduces the exact result on load', async ({ page }) => {
  await page.goto('/?b=10&h=4')
  await expect(page.getByRole('heading', { name: 'Rick Blaine' })).toBeVisible()
  // Stats reflect the encoded input: 10 beers = 23 units.
  await expect(page.locator('.stats-strip')).toContainText('23')
})

test('a heavier share URL maps to a higher tier', async ({ page }) => {
  // 35 beers = 80.5 units → Babe Ruth's band (79.5–83.3).
  await page.goto('/?b=35&h=8')
  await expect(page.getByRole('heading', { name: 'Babe Ruth' })).toBeVisible()
})
