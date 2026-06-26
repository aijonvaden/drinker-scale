import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const baseURL = `http://localhost:${PORT}`

// Specs that only need to run once (screenshots, axe, file-download).
const HEAVY = ['**/responsive.spec.ts', '**/a11y.spec.ts', '**/share.spec.ts']

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  reporter: [['list']],
  timeout: 45000,
  expect: { timeout: 8000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180000,
  },
  projects: [
    // chromium runs the full suite, including the single-run heavy specs.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Other engines/channels run the cross-engine functional specs only.
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: HEAVY },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: HEAVY },
    { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, testIgnore: HEAVY },
    { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' }, testIgnore: HEAVY },
  ],
})
