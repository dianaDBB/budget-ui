import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the Single File Conversion section with three bank cards', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goToSingleSection();
    });

    await test.step('Verify the ActivoBank card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleFile.activoBank.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleFile.activoBank.convertButton()).toBeDisabled();
    });

    await test.step('Verify the Crédito Agrícola card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleFile.creditoAgricola.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleFile.creditoAgricola.convertButton()).toBeDisabled();
    });

    await test.step('Verify the Crypto.com card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleFile.cryptoCom.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleFile.cryptoCom.convertButton()).toBeDisabled();
    });
  });
});
