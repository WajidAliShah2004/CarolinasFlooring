import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// Optional: PW_CHANNEL=msedge (or chrome) runs against an installed browser instead of Playwright's Chromium.
const channel = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...channel, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], ...channel, viewport: { width: 375, height: 812 }, hasTouch: true } },
  ],
});
