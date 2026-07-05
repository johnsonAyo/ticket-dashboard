import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const WEB_BASE_URL = 'http://localhost:5173';
const API_HEALTH_URL = 'http://localhost:3000/api/health';
const SERVER_BOOT_TIMEOUT_MS = 120_000;

// webServer commands use the workspace flag, so they must run from the repo root.
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: WEB_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run serve -w @ticket/api',
      cwd: repoRoot,
      url: API_HEALTH_URL,
      timeout: SERVER_BOOT_TIMEOUT_MS,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -w @ticket/web',
      cwd: repoRoot,
      url: WEB_BASE_URL,
      timeout: SERVER_BOOT_TIMEOUT_MS,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
