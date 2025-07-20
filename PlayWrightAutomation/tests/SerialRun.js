const { test, expect } = require('@playwright/test');

// Configure this group to run in parallel
test.describe('Parallel Group', () => {
  test.describe.configure({ mode: 'parallel' });

  test('Test 1', async ({ page }) => {
    // runs in parallel with Test 2
  });

  test('Test 2', async ({ page }) => {
    // runs in parallel with Test 1
  });
});

// Configure this group to run in serial
test.describe('Serial Group', () => {
  test.describe.configure({ mode: 'serial' });

  test('Test 3', async ({ page }) => {
    // runs first in this group
  });

  test('Test 4', async ({ page }) => {
    // runs after Test 3
  });
});

// Other tests outside describe.serial will run in parallel (if config allows)
test('Parallel Test', async ({ page }) => {
  // runs in parallel with other parallel tests
});