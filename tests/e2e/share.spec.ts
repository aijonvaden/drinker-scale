import { test, expect } from '@playwright/test'

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

test.describe('sharing', () => {
  test('Copy Link writes a reproducible URL to the clipboard', async ({ page }) => {
    await page.goto('/?b=10&h=4')
    await page.getByRole('button', { name: /Copy Link/i }).click()
    await expect(page.getByText(/Link copied/i)).toBeVisible()
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    expect(clip).toContain('b=10')
    expect(clip).toContain('h=4')
  })

  test('Download Card produces a PNG', async ({ page }) => {
    await page.goto('/?b=10&h=4')
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /Download Card/i }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/drinking-legend-.*\.png/)
  })
})
