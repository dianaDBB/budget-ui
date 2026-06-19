import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Convert (without preview)', () => {
  test('should convert and download when only "ActivoBank" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid ActivoBank file to the ActivoBank input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/ActivoBank.xlsx');
      await budgetPage.locators.multiFile.activoBank.fileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiFile.activoBank.selectedFile()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeEnabled();
    });

    await test.step('Click the Convert All button and verify a file download is triggered', async () => {
      const downloadPromise = budgetPage.page.waitForEvent('download');
      await budgetPage.locators.multiFile.convertAllButton().click();
      await downloadPromise;
    });

    await test.step('Verify the success alert appears with the correct message', async () => {
      await expect(budgetPage.locators.multiFile.successAlert()).toContainText('All files converted successfully');
    });

    await test.step('Verify all file areas reset to No file selected', async () => {
      await expect(budgetPage.locators.multiFile.activoBank.selectedFile()).toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeDisabled();
    });
  });

  test('should convert and download when only "Crédito Agrícola" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid Crédito Agrícola file to the Crédito Agrícola input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/CreditoAgricola.xlsx');
      await budgetPage.locators.multiFile.creditoAgricola.fileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiFile.creditoAgricola.selectedFile()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeEnabled();
    });

    await test.step('Click the Convert All button and verify a file download is triggered', async () => {
      const downloadPromise = budgetPage.page.waitForEvent('download');
      await budgetPage.locators.multiFile.convertAllButton().click();
      await downloadPromise;
    });

    await test.step('Verify the success alert appears with the correct message', async () => {
      await expect(budgetPage.locators.multiFile.successAlert()).toContainText('All files converted successfully');
    });

    await test.step('Verify all file areas reset to No file selected', async () => {
      await expect(budgetPage.locators.multiFile.creditoAgricola.selectedFile()).toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeDisabled();
    });
  });

  test('should convert and download when only "CryptoCom" file is provided', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid Crypto.com file to the Crypto.com input only', async () => {
      const filePath = path.join(process.cwd(), '/tests/resources/CryptoCom.csv');
      await budgetPage.locators.multiFile.cryptoCom.fileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.multiFile.cryptoCom.selectedFile()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeEnabled();
    });

    await test.step('Click the Convert All button and verify a file download is triggered', async () => {
      const downloadPromise = budgetPage.page.waitForEvent('download');
      await budgetPage.locators.multiFile.convertAllButton().click();
      await downloadPromise;
    });

    await test.step('Verify the success alert appears with the correct message', async () => {
      await expect(budgetPage.locators.multiFile.successAlert()).toContainText('All files converted successfully');
    });

    await test.step('Verify all file areas reset to No file selected', async () => {
      await expect(budgetPage.locators.multiFile.cryptoCom.selectedFile()).toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeDisabled();
    });
  });
});
