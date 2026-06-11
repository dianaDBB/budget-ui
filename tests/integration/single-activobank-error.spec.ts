import { test, expect } from '@fixtures';
import path from 'path';

test.describe('Single File Conversion - ActivoBank', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();

    await budgetMock.mockGenerateActivoBankFile({ success: false });
  });

  test('should show error alert when conversion fails with an invalid file', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Upload a plain text file to the ActivoBank file input', async () => {
      const filePath = path.join(process.cwd(), `/tests/resources/ActivoBank-Invalid.xlsx`);
      await budgetPage.locators.singleSection.activoBank.fileInput().setInputFiles(filePath);
    });

    await test.step('Click the Convert button in the ActivoBank card', async () => {
      await budgetPage.locators.singleSection.activoBank.convertButton().click();
    });

    await test.step('Verify an error alert is shown inside the ActivoBank card', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.errorAlert()).toBeVisible();
    });
  });
});
