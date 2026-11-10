import fs from 'node:fs';
import { defineConfig } from '@playwright/test';

// The e2e workflow runs on Replit, where Chromium lives at
// /repl/tools/bin/chromium. Local macOS runs fall back to the system Chrome
// channel so the same suite is runnable outside the Replit image.
const replitChromium = '/repl/tools/bin/chromium';
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (fs.existsSync(replitChromium) ? replitChromium : undefined);

// Dedicated port for the test server so it never collides with the dev server.
const port = process.env.E2E_PORT || '4273';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL || `http://127.0.0.1:${port}`,
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    ...(executablePath
      ? { launchOptions: { executablePath, args: ['--no-sandbox'] } }
      : { channel: 'chrome' }),
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: `PORT=${port} BASE_PATH=/ pnpm run dev`,
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
