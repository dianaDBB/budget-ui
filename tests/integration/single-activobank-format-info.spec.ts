import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 6.2 - Single format info popover for ActivoBank', () => {
  test('should show format info popover with header, badge and html for ActivoBank', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetPage.goToSingleSection();

    await budgetPage.locators.singleFile.activoBank.formatInfo.button().click();

    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.header()).toBeVisible();
    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.header()).toContainText('ActivoBank');
    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.fileExtension()).toContainText('XLSX');
    await expect(budgetPage.locators.singleFile.activoBank.formatInfo.popover.htmlExample()).toBeVisible();
  });
});
