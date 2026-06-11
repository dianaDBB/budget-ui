import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - Crypto.com', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();

    await budgetMock.mockGenerateCryptoComFile({ success: false });
  });

  test('should show error alert when conversion fails with an invalid file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a plain text file to the Crypto.com file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/CryptoCom-Invalid.csv`);
      await budgetPage.locators.singleSection.cryptoCom.fileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert button in the Crypto.com card', async () => {
      await budgetPage.locators.singleSection.cryptoCom.convertButton().click();
    });

    await test.step('Verify an error alert is shown inside the Crypto.com card', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.errorAlert()).toBeVisible();
    });
  });
});
