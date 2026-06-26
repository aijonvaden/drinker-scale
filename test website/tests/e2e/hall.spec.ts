import { test, expect } from '@playwright/test'

test('Hall of Legends: browse, filter, search, drill in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Enter the Hall of Legends/i }).click()

  const hall = page.getByRole('dialog', { name: /Hall of Legends/i })
  await expect(hall.getByText(/Immortals of Intake/i)).toBeVisible()

  const cards = page.locator('.hall-card')
  await expect(cards).toHaveCount(96)

  // Search narrows the grid.
  await page.getByLabel('Search legends').fill('Homer')
  await expect(cards).toHaveCount(1)
  await cards.first().click()

  const detail = page.getByRole('dialog', { name: 'Homer Simpson' })
  await expect(detail.getByRole('heading', { name: 'Homer Simpson' })).toBeVisible()
  await expect(detail.getByText(/Did You Know/i)).toBeVisible()

  await detail.getByRole('button', { name: /Close/i }).click()
  await expect(detail).toBeHidden()
})
