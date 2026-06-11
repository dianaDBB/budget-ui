import { test, expect } from '@fixtures';

test.describe('Page Load and Layout', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the Multiple File Conversion section', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the Convert Multiple Files card heading is visible', async () => {
      await expect(budgetPage.locators.multiFile.header()).toBeVisible();
    });

    await test.step('Verify ActivoBank file area shows No file selected', async () => {
      await expect(budgetPage.locators.multiFile.activoBank.selectedFile()).toContainText('No file selected');
    });

    await test.step('Verify Crédito Agrícola file area shows No file selected', async () => {
      await expect(budgetPage.locators.multiFile.creditoAgricola.selectedFile()).toContainText('No file selected');
    });

    await test.step('Verify Crypto.com file area shows No file selected', async () => {
      await expect(budgetPage.locators.multiFile.cryptoCom.selectedFile()).toContainText('No file selected');
    });

    await test.step('Verify the Convert All button is visible and disabled', async () => {
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeVisible();
      await expect(budgetPage.locators.multiFile.convertAllButton()).toBeDisabled();
    });
  });
});
