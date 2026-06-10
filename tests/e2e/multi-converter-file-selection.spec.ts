import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test('should enable Convert All button when at least one file is selected', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a file to the ActivoBank input in the Multiple File Conversion card', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.multiSection.activoBankFileInput().setInputFiles(filePath);
    });

    await test.step('Verify the ActivoBank file area shows the selected file name', async () => {
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).toContainText('ActivoBank-Invalid.xlsx');
    });

    await test.step('Verify Crédito Agrícola and Crypto.com areas still show No file selected', async () => {
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.cryptoComFileDisplay()).toContainText('No file selected');
    });

    await test.step('Verify the Convert All button is now enabled', async () => {
      await expect(budgetPage.locators.multiSection.convertAllButton()).toBeEnabled();
    });
  });
});
