import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test('should show error only "ActivoBank" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid ActivoBank file to the ActivoBank input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/ActivoBank.xlsx');
      await budgetPage.locators.multiSection.activoBankFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).not.toContainText('No file selected');
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiSection.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown because not all files were provided', async () => {
      await expect(budgetPage.locators.multiSection.errorAlert()).toBeVisible();
    });
  });

  test('should show error only "Crédito Agrícola" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid Crédito Agrícola file to the Crédito Agrícola input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/CreditoAgricola.xlsx');
      await budgetPage.locators.multiSection.creditoAgricolaFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).not.toContainText('No file selected');
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiSection.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown because not all files were provided', async () => {
      await expect(budgetPage.locators.multiSection.errorAlert()).toBeVisible();
    });
  });

  test('should show error only "CryptoCom" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid Crypto.com file to the Crypto.com input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/CryptoCom.csv');
      await budgetPage.locators.multiSection.cryptoComFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.cryptoComFileDisplay()).not.toContainText('No file selected');
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiSection.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown because not all files were provided', async () => {
      await expect(budgetPage.locators.multiSection.errorAlert()).toBeVisible();
    });
  });
});
