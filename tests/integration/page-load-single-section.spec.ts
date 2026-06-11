import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the Single File Conversion section with three bank cards', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the Single File Conversion section heading is visible', async () => {
      await expect(budgetPage.locators.singleSection.sectionHeading()).toBeVisible();
    });

    await test.step('Verify the ActivoBank card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleSection.activoBank.convertButton()).toBeDisabled();
    });

    await test.step('Verify the Crédito Agrícola card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleSection.creditoAgricola.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleSection.creditoAgricola.convertButton()).toBeDisabled();
    });

    await test.step('Verify the Crypto.com card is visible with Convert button disabled', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.fileInput()).toContainText('Click to select file');
      await expect(budgetPage.locators.singleSection.cryptoCom.convertButton()).toBeDisabled();
    });
  });
});
