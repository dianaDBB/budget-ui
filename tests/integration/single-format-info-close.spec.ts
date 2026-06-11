import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 6.5 - Single format info popover close', () => {
  test('should close the format info popover when the close button is clicked', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetPage.goTo();

    await budgetPage.locators.singleFile.activoBank.formatInfo.button().click();
    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.header()).toBeVisible();

    await budgetPage.locators.singleFile.activoBank.formatInfo.popover.closeButton().click();
    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.header()).not.toBeVisible();
  });
});
