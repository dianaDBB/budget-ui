import { test, expect } from '@fixtures';

test.describe('Single File Conversion - ActivoBank', () => {
  test('should have Convert button disabled before file selection', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the Convert button inside the ActivoBank card is disabled', async () => {
      await expect(budgetPage.locators.singleSection.activoBank.convertButton()).toBeDisabled();
    });
  });
});
