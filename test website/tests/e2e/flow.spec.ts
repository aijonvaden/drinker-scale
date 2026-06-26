import { test, expect } from '@playwright/test'

test('full flow: log drinks → verdict → reset, with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /Legendary Drinker Scale/i })).toBeVisible()

  await page.getByLabel('Beers', { exact: true }).fill('10')
  await expect(page.locator('.tally-num')).toHaveText('23')

  await page.getByRole('button', { name: /Render Verdict/i }).click()

  await expect(page.getByRole('heading', { name: 'Rick Blaine' })).toBeVisible()
  await expect(page.getByText(/Did You Know/i)).toBeVisible()
  await expect(page.locator('.stats-strip .stat-val').first()).toBeVisible()
  await expect(page.locator('.percentile-bar')).toBeVisible()
  await expect(page.locator('.andre-distance')).toContainText(/units from André/i)

  await page.getByRole('button', { name: /Confess Again/i }).click()
  await expect(page.getByText(/Log Your Evening/i)).toBeVisible()

  expect(errors, errors.join('\n')).toEqual([])
})

test('steppers increment and drive the live tally', async ({ page }) => {
  await page.goto('/')
  const beers = page.getByLabel('Beers', { exact: true })
  await expect(beers).toHaveValue('0')
  await page.getByRole('button', { name: 'Add one Beers' }).click()
  await page.getByRole('button', { name: 'Add one Beers' }).click()
  await expect(beers).toHaveValue('2')
  await expect(page.locator('.tally-num')).toHaveText('5') // 2 beers * 2.3 = 4.6 → 5

  await expect(page.getByRole('button', { name: /Render Verdict/i })).toBeEnabled()
})

test('Render Verdict is disabled until a drink is logged', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Render Verdict/i })).toBeDisabled()
})
