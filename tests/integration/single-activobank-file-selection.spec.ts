import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - ActivoBank', () => {
  test('should enable Convert button after selecting a file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a file to the ActivoBank file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank.xlsx`);
      await budgetPage.locators.singleSection.activoBank.fileInput().setInputFiles(filePath);
    });

    await test.step('Verify the file label changes to show the selected file name', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.fileInput()).toContainText('ActivoBank.xlsx');
    });

    await test.step('Verify the Convert button in the ActivoBank card is now enabled', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.convertButton()).toBeEnabled();
    });
  });
});
