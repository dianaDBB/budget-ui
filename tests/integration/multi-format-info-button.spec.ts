import { test, expect } from '@fixtures';

test.describe('Format Info — Multiple File Conversion', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the info icon button on the Multiple File Conversion card', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the info icon button is visible in the Multiple File Conversion card header', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoButton()).toBeVisible();
    });
  });
});
