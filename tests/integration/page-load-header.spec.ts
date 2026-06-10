import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test('should display the page header correctly', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application and wait for network idle', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the page title is Budget UI - File Conversion', async () => {
      await expect(budgetPage.page).toHaveTitle('Budget UI - File Conversion');
    });

    await test.step('Verify the heading Budget is visible', async () => {
      await expect(budgetPage.locators.header.title()).toBeVisible();
    });

    await test.step('Verify the subtitle is visible', async () => {
      await expect(budgetPage.locators.header.subtitle()).toBeVisible();
    });
  });
});
