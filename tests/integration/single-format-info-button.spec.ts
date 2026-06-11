import { test, expect } from '@fixtures';

test.describe('Format Info — Single File Conversion', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should display the info icon button on each bank card', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the info icon button is visible on the ActivoBank card', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.formatInfoButton()).toBeVisible();
    });

    await test.step('Verify the info icon button is visible on the Crédito Agrícola card', async () => {
      await expect(budgetPage.locators.singleSection.creditoAgricola.formatInfoButton()).toBeVisible();
    });

    await test.step('Verify the info icon button is visible on the Crypto.com card', async () => {
      await expect(budgetPage.locators.singleSection.cryptoCom.formatInfoButton()).toBeVisible();
    });
  });
});
