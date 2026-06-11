import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();

    await budgetMock.mockGenerateFile({ bankId: BankId.all, success: false });
  });

  test('should not clear previously selected files after a failed conversion', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a file to the ActivoBank input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.multiFile.activoBank.fileInput().setInputFiles(filePath);
    });

    await test.step('Upload a file to the Crédito Agrícola input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CreditoAgricola-Invalid.xlsx`);
      await budgetPage.locators.multiFile.creditoAgricola.fileInput().setInputFiles(filePath);
    });

    await test.step('Upload a file to the Crypto.com input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CryptoCom-Invalid.csv`);
      await budgetPage.locators.multiFile.cryptoCom.fileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiFile.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown', async () => {
      await expect(budgetPage.locators.multiFile.errorAlert()).toBeVisible();
    });

    await test.step('Verify previously selected files remain in the file areas after the error', async () => {
      await expect(budgetPage.locators.multiFile.activoBank.selectedFile()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.creditoAgricola.selectedFile()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.cryptoCom.selectedFile()).not.toContainText('No file selected');
    });
  });
});
