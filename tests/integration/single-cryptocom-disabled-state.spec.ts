import { test, expect } from '@fixtures';

test.describe('Single File Conversion - Crypto.com', () => {
  test.beforeEach(async ({ mockSetup }) => {
    await mockSetup.setMockMode();
  });

  test('should have Convert button disabled before file selection', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Verify the Convert button inside the Crypto.com card is disabled', async () => {
      await expect(budgetPage.locators.singleFile.cryptoCom.convertButton()).toBeDisabled();
    });
  });
});
