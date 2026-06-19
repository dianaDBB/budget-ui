import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Convert (without preview)', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should enable Convert All button when at least one file is selected', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goToMultiSection();
    });

    await test.step('Upload a file to the ActivoBank input in the Convert (without preview) card', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.multiFile.activoBank.fileInput().setInputFiles(filePath);
    });

    await test.step('Verify the ActivoBank file area shows the selected file name', async () => {
      await expect(budgetPage.locators.multiFile.activoBank.selectedFile()).toContainText('ActivoBank-Invalid.xlsx');
    });

    await test.step('Verify Crédito Agrícola and Crypto.com areas still show No file selected', async () => {
      await expect(budgetPage.locators.multiFile.creditoAgricola.selectedFile()).toContainText('No file selected');
      await expect(budgetPage.locators.multiFile.cryptoCom.selectedFile()).toContainText('No file selected');
    });

    await test.step('Verify the Convert All button is now enabled', async () => {
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeEnabled();
    });
  });
});
