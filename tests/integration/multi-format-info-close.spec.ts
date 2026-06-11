import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Format Info — Multiple File Conversion', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetMock.mockGetBankFormat({ bankId: BankId.creditoAgricola });
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
  });

  test('should close the format popover when clicking the close button', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Click the info icon button on the Multiple File Conversion card', async () => {
      await budgetPage.locators.multiSection.formatInfoButton().click();
    });

    await test.step('Verify the format popover is visible', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoPopover.header()).toBeVisible();
    });

    await test.step('Click the close button inside the popover', async () => {
      await budgetPage.locators.multiSection.formatInfoPopover.closeButton().click();
    });

    await test.step('Verify the format popover is no longer visible', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoPopover.header()).not.toBeVisible();
    });
  });
});
