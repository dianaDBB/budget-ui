import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the footer', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the footer text is visible', async () => {
      await expect(budgetPage.locators.footer()).toBeVisible();
    });
  });
});
