import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Multiple File Conversion', () => {
  test('should show error alert when conversion fails with an invalid file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a plain text file to the ActivoBank input in the Multiple File Conversion card', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.multiSection.activoBankFileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert All button', async () => {
      await budgetPage.locators.multiSection.convertAllButton().click();
    });

    await test.step('Verify an error alert is shown inside the Multiple File Conversion card', async () => {
      await expect(budgetPage.locators.multiSection.errorAlert()).toBeVisible();
    });
  });
});
