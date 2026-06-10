import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test('should convert and download when all three bank files are provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid ActivoBank CSV file to the ActivoBank input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank.xlsx`);
      await budgetPage.locators.multiSection.activoBankFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).not.toContainText('No file selected');
    });

    await test.step('Upload a valid Crédito Agrícola CSV file to the Crédito Agrícola input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CreditoAgricola.xlsx`);
      await budgetPage.locators.multiSection.creditoAgricolaFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).not.toContainText('No file selected');
    });

    await test.step('Upload a valid Crypto.com CSV file to the Crypto.com input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CryptoCom.csv`);
      await budgetPage.locators.multiSection.cryptoComFileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiSection.cryptoComFileDisplay()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.convertAllButton()).toBeEnabled();
    });

    await test.step('Click the Convert All button and verify a file download is triggered', async () => {
      const downloadPromise = budgetPage.page.waitForEvent('download');
      await budgetPage.locators.multiSection.convertAllButton().click();
      await downloadPromise;
    });

    await test.step('Verify the success alert appears with the correct message', async () => {
      await expect(budgetPage.locators.multiSection.successAlert()).toContainText('All files converted successfully');
    });

    await test.step('Verify all file areas reset to No file selected', async () => {
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.cryptoComFileDisplay()).toContainText('No file selected');
    });

    await test.step('Verify the Convert All button becomes disabled again', async () => {
      await expect(budgetPage.locators.multiSection.convertAllButton()).toBeDisabled();
    });
  });
});
