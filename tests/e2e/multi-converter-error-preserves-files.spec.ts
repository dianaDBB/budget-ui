import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test('should not clear previously selected files after a failed conversion', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a plain text file to the ActivoBank input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.multiSection.activoBankFileInput().setInputFiles(filePath);
    });

    await test.step('Upload a plain text file to the Crédito Agrícola input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CreditoAgricola-Invalid.xlsx`);
      await budgetPage.locators.multiSection.creditoAgricolaFileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiSection.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown', async () => {
      await expect(budgetPage.locators.multiSection.errorAlert()).toBeVisible();
    });

    await test.step('Verify previously selected files remain in the file areas after the error', async () => {
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).not.toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).not.toContainText('No file selected');
    });
  });
});
