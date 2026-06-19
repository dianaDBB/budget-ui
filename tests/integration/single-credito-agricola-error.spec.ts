import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - Crédito Agrícola', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();

    await budgetMock.mockGenerateFile({ bankId: BankId.creditoAgricola, success: false });
  });

  test('should show error alert when conversion fails with an invalid file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goToSingleSection();
    });

    await test.step('Upload a plain text file to the Crédito Agrícola file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CreditoAgricola-Invalid.xlsx`);
      await budgetPage.locators.singleFile.creditoAgricola.fileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert button in the Crédito Agrícola card', async () => {
      await budgetPage.locators.singleFile.creditoAgricola.convertButton().click();
    });

    await test.step('Verify an error alert is shown inside the Crédito Agrícola card', async () => {
      await expect(budgetPage.locators.singleFile.creditoAgricola.errorAlert()).toBeVisible();
    });
  });
});
