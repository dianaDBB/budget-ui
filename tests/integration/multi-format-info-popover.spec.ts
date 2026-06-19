import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Scenario 7.2 - Multi format info popover shows all bank formats', () => {
  test('should show format info popover with all three bank sections, badges and html', async ({
    mockSetup,
    budgetMock,
    budgetPage,
  }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetMock.mockGetBankFormat({ bankId: BankId.creditoAgricola });
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
    await budgetPage.goToMultiSection();

    await budgetPage.locators.multiFile.formatInfo.button().click();

    await expect(budgetPage.locators.multiFile.formatInfo.popover.header()).toBeVisible();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.header()).toContainText('Example of input files');

    await expect(budgetPage.locators.multiFile.formatInfo.popover.bankSection(BankId.activoBank)).toBeVisible();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.fileExtension(BankId.activoBank)).toContainText(
      'XLSX',
    );
    await expect(budgetPage.locators.multiFile.formatInfo.popover.htmlExample(BankId.activoBank)).toBeVisible();

    await expect(budgetPage.locators.multiFile.formatInfo.popover.bankSection(BankId.creditoAgricola)).toBeVisible();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.fileExtension(BankId.creditoAgricola)).toContainText(
      'XLSX',
    );
    await expect(budgetPage.locators.multiFile.formatInfo.popover.htmlExample(BankId.creditoAgricola)).toBeVisible();

    await expect(budgetPage.locators.multiFile.formatInfo.popover.bankSection(BankId.cryptoCom)).toBeVisible();
    await expect(budgetPage.locators.multiFile.formatInfo.popover.fileExtension(BankId.cryptoCom)).toContainText('CSV');
    await expect(budgetPage.locators.multiFile.formatInfo.popover.htmlExample(BankId.cryptoCom)).toBeVisible();
  });
});
