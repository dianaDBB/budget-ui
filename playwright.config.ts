import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
  quiet: true,
});

export default defineConfig({
  globalTimeout: 60 * 60 * 1000, // 60min timeout for all tests
  timeout: 5 * 60 * 1000, // 5min timeout per test case
  retries: process.env.ENV == 'PROD' ? 1 : 0,
  workers: process.env.ENV == 'PROD' ? 3 : 8,
  reporter: [
    ['list'],
    [
      'junit',
      {
        outputFile: 'tests/reports/junit/junit.xml',
      },
    ],
    [
      'html',
      {
        outputFolder: 'tests/reports/html',
        open: 'never',
      },
    ],
  ],
  expect: {
    timeout: 5000, // 5sec timeout for expectations
  },
  use: {
    headless: true,
    browserName: 'chromium',
    ignoreHTTPSErrors: true,
    actionTimeout: 5000, // 5sec timeout for actions
    testIdAttribute: 'data-testid',
    acceptDownloads: true,
    bypassCSP: true,
    screenshot: {
      mode: 'only-on-failure',
    },
    video: process.env.ENV == 'PROD' ? 'on-first-retry' : 'retain-on-failure',
    trace: process.env.ENV == 'PROD' ? 'on-first-retry' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'integration',
      testMatch: '**/tests/integration/**/*.spec.ts',
      outputDir: 'tests/output/integration',
      use: {
        baseURL: 'http://localhost:5173/',
      },
      fullyParallel: true,
    },
    {
      name: 'contract',
      testMatch: '**/tests/contract/**/*.spec.ts',
      outputDir: 'tests/output/contract',
      use: {
        baseURL: 'https://budget-ui-ht2i.onrender.com/',
      },
      fullyParallel: true,
    },
    {
      name: 'e2e',
      testMatch: '**/tests/e2e/**/*.spec.ts',
      outputDir: 'tests/output/e2e',
      use: {
        baseURL: 'https://budget-ui-ht2i.onrender.com/',
        actionTimeout: 10000, // e2e are slow, increase default action timeout to 10sec
      },
      expect: {
        timeout: 10000, // e2e are slow, increase default expect timeout to 10sec
      },
    },
  ],
});
