import { test, expect } from '@fixtures';

test.describe('Multiple File Conversion', () => {
  test('should have Convert All button disabled when no files are selected', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify all three file areas show No file selected', async () => {
      await expect(budgetPage.locators.multiSection.activoBankFileDisplay()).toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.creditoAgricolaFileDisplay()).toContainText('No file selected');
      await expect(budgetPage.locators.multiSection.cryptoComFileDisplay()).toContainText('No file selected');
    });

    await test.step('Verify the Convert All button is disabled', async () => {
      await expect(budgetPage.locators.multiSection.convertAllButton()).toBeDisabled();
    });
  });
});
