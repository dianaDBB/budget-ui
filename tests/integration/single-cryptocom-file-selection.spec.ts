import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - Crypto.com', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should enable Convert button after selecting a file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a file to the Crypto.com file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CryptoCom.csv`);
      await budgetPage.locators.singleSection.cryptoCom.fileInput().setInputFiles(filePath);
    });

    await test.step('Verify the file label changes to show the selected file name', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.fileInput()).toContainText('CryptoCom.csv');
    });

    await test.step('Verify the Convert button in the Crypto.com card is now enabled', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.convertButton()).toBeEnabled();
    });
  });
});
