import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 6.4 - Single format info popover for Crypto.com', () => {
  test('should show format info popover with header, badge and html for Crypto.com', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
    await budgetPage.goTo();

    await budgetPage.locators.singleFile.cryptoCom.formatInfo.button().click();

    await expect(budgetPage.locators.singleFile.cryptoCom.formatInfo.popover.header()).toBeVisible();
    await expect(budgetPage.locators.singleFile.cryptoCom.formatInfo.popover.header()).toContainText('Crypto.com');
    await expect(budgetPage.locators.singleFile.cryptoCom.formatInfo.popover.fileExtension()).toContainText('CSV');
    await expect(budgetPage.locators.singleFile.cryptoCom.formatInfo.popover.htmlExample()).toBeVisible();
  });
});
