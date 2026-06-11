import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the welcome intro section', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the Welcome to Budget Application heading is visible', async () => {
      await expect(budgetPage.locators.intro.heading()).toBeVisible();
    });

    await test.step('Verify the description paragraph is visible', async () => {
      await expect(budgetPage.locators.intro.description()).toBeVisible();
    });
  });
});
