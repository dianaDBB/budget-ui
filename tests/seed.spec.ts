import { test, expect } from '@fixtures';

test.describe('Test group', () => {
  test('Seed', async ({ budgetPage }) => {
    await test.step('Step example', async () => {
      await budgetPage.goTo();
      await expect(budgetPage.locators.footer()).toBeVisible();
    });
    // generate code here.
  });
});
