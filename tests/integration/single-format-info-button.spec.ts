import { test, expect } from '@fixtures';

test.describe('Scenario 6.1 - Single format info buttons visible', () => {
  test('should show a format info button for each single bank card', async ({ mockSetup, budgetPage }) => {
    await mockSetup.setMockMode();
    await budgetPage.goToSingleSection();

    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.button()).toBeVisible();
    await expect(budgetPage.locators.singleFile.creditoAgricola.formatInfo.button()).toBeVisible();
    await expect(budgetPage.locators.singleFile.cryptoCom.formatInfo.button()).toBeVisible();
  });
});
