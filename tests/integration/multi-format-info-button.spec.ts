import { test, expect } from '@fixtures';

test.describe('Scenario 7.1 - Multi section format info button visible', () => {
  test('should show a format info button in the multiple file conversion section', async ({
    mockSetup,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetPage.goToMultiSection();

    await expect(budgetPage.locators.multiFile.formatInfo.button()).toBeVisible();
  });
});
