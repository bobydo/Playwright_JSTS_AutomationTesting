import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    screenshot: 'on', // Take screenshot on failure (use 'only-on-failure', 'on', or 'off')
    video: 'retain-on-failure', // Record video on failure
    trace: 'retain-on-failure', // Collect trace on failure
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] }, // Emulate iPhone 12
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] }, // Emulate Pixel 5
    },
    {
      name: 'iPad (gen 7)',
      use: { ...devices['iPad (gen 7)'] }, // Emulate iPad
    },
  ],
});