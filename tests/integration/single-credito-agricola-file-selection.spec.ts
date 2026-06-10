import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - Crédito Agrícola', () => {
  test('should enable Convert button after selecting a file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a file to the Crédito Agrícola file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CreditoAgricola.xlsx`);
      await budgetPage.locators.singleSection.creditoAgricola.fileInput().setInputFiles(filePath);
    });

    await test.step('Verify the file label changes to show the selected file name', async () => {
      await expect(budgetPage.locators.singleSection.creditoAgricola.fileLabel()).toContainText('CreditoAgricola.xlsx');
    });

    await test.step('Verify the Convert button in the Crédito Agrícola card is now enabled', async () => {
      await expect(budgetPage.locators.singleSection.creditoAgricola.convertButton()).toBeEnabled();
    });
  });
});
