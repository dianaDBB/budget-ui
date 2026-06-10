import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - Crypto.com', () => {
  test('should show success alert and reset inputs after successful conversion', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a valid Crypto.com CSV file to the Crypto.com file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CryptoCom.csv`);
      await budgetPage.locators.singleSection.cryptoCom.fileInput().setInputFiles(filePath);
      await expect(budgetPage.locators.singleSection.cryptoCom.fileLabel()).not.toContainText('Click to select file');
    });

    await test.step('Click the Convert button and verify a file download is triggered', async () => {
      const downloadPromise = budgetPage.page.waitForEvent('download');
      await budgetPage.locators.singleSection.cryptoCom.convertButton().click();
      await downloadPromise;
    });

    await test.step('Verify the success alert appears with the correct message', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.successAlert()).toContainText(
        'File converted successfully',
      );
    });

    await test.step('Verify the file label resets to Click to select file', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.fileLabel()).toContainText('Click to select file');
    });

    await test.step('Verify the Convert button becomes disabled again', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.convertButton()).toBeDisabled();
    });
  });
});
