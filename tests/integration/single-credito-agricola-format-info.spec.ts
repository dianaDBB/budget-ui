import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 6.3 - Single format info popover for Crédito Agrícola', () => {
  test('should show format info popover with header, badge and html for Crédito Agrícola', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.creditoAgricola });
    await budgetPage.goToSingleSection();

    await budgetPage.locators.singleFile.creditoAgricola.formatInfo.button().click();

    await expect(budgetPage.locators.singleFile.creditoAgricola.formatInfo.popover.header()).toBeVisible();
    await expect(budgetPage.locators.singleFile.creditoAgricola.formatInfo.popover.header()).toContainText(
      'Crédito Agrícola',
    );
    await expect(budgetPage.locators.singleFile.creditoAgricola.formatInfo.popover.fileExtension()).toContainText(
      'XLSX',
    );
    await expect(budgetPage.locators.singleFile.creditoAgricola.formatInfo.popover.htmlExample()).toBeVisible();
  });
});
