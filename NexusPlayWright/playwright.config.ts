import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

// Explicitly load .env so all process.env vars are available in test workers
loadEnv({ path: resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    /* Base URL for the Nexus frontend — override via BASE_URL env var or .env file */
    baseURL: process.env.BASE_URL ?? 'https://localhost:3000',

    /* Ignore self-signed certificate errors (Vite dev server uses basicSsl) */
    ignoreHTTPSErrors: true,

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
