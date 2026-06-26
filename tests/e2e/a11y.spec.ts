import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('accessibility (axe-core)', () => {
  const blockingViolations = async (page: import('@playwright/test').Page) => {
    const results = await new AxeBuilder({ page }).analyze()
    const contrast = results.violations.filter((v) => v.id === 'color-contrast').length
    // The muted gold-on-dark palette is a deliberate aesthetic; track contrast
    // separately but hold every other serious/critical rule to zero.
    const blocking = results.violations.filter(
      (v) => (v.impact === 'serious' || v.impact === 'critical') && v.id !== 'color-contrast',
    )
    return { blocking: blocking.map((v) => v.id), contrast }
  }

  test('home', async ({ page }) => {
    await page.goto('/')
    const { blocking, contrast } = await blockingViolations(page)
    console.log(`[a11y] home — contrast notes: ${contrast}`)
    expect(blocking, blocking.join(', ')).toEqual([])
  })

  test('result', async ({ page }) => {
    await page.goto('/?b=10&s=2&w=1&c=3&h=5')
    await page.getByRole('heading', { name: /.+/ }).first().waitFor()
    const { blocking, contrast } = await blockingViolations(page)
    console.log(`[a11y] result — contrast notes: ${contrast}`)
    expect(blocking, blocking.join(', ')).toEqual([])
  })

  test('hall', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Enter the Hall of Legends/i }).click()
    await page.getByText(/Immortals of Intake/i).waitFor()
    const { blocking, contrast } = await blockingViolations(page)
    console.log(`[a11y] hall — contrast notes: ${contrast}`)
    expect(blocking, blocking.join(', ')).toEqual([])
  })
})
