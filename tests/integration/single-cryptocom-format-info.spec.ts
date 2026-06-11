import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Format Info — Single File Conversion', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
  });

  test('should open the format popover for Crypto.com when clicking the info button', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Click the info icon button on the Crypto.com card', async () => {
      await budgetPage.locators.singleSection.cryptoCom.formatInfoButton().click();
    });

    await test.step('Verify the format popover header is visible and contains the bank name', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.header(BankId.cryptoCom)).toBeVisible();
    });

    await test.step('Verify the file format badge shows CSV', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.badge()).toContainText('CSV');
    });

    await test.step('Verify the HTML example content is rendered', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.htmlContent()).toBeVisible();
    });
  });
});
