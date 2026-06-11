import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 7.3 - Multi format info popover close', () => {
  test('should close the multi format info popover when the close button is clicked', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetMock.mockGetBankFormat({ bankId: BankId.creditoAgricola });
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
    await budgetPage.goTo();

    await budgetPage.locators.multiFile.formatInfo.button().click();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.header()).toBeVisible();

    await budgetPage.locators.multiFile.formatInfo.popover.closeButton().click();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.header()).not.toBeVisible();
  });
});
