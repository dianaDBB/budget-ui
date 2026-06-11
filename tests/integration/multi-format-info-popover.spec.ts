import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Format Info — Multiple File Conversion', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
    await budgetMock.mockGetBankFormat({ bankId: BankId.creditoAgricola });
    await budgetMock.mockGetBankFormat({ bankId: BankId.cryptoCom });
  });

  test('should open the format popover showing all three bank formats', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Click the info icon button on the Multiple File Conversion card', async () => {
      await budgetPage.locators.multiSection.formatInfoButton().click();
    });

    await test.step('Verify the format popover header is visible', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoPopover.header()).toBeVisible();
    });

    await test.step('Verify the ActivoBank section is visible with its format badge and HTML example', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankSection(BankId.activoBank)).toBeVisible();
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankBadge(BankId.activoBank)).toContainText(
        'XLSX',
      );
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankHtmlContent(BankId.activoBank)).toBeVisible();
    });

    await test.step('Verify the Crédito Agrícola section is visible with its format badge and HTML example', async () => {
      await expect(
        budgetPage.locators.multiSection.formatInfoPopover.bankSection(BankId.creditoAgricola),
      ).toBeVisible();
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankBadge(BankId.creditoAgricola)).toContainText(
        'XLSX',
      );
      await expect(
        budgetPage.locators.multiSection.formatInfoPopover.bankHtmlContent(BankId.creditoAgricola),
      ).toBeVisible();
    });

    await test.step('Verify the Crypto.com section is visible with its format badge and HTML example', async () => {
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankSection(BankId.cryptoCom)).toBeVisible();
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankBadge(BankId.cryptoCom)).toContainText('CSV');
      await expect(budgetPage.locators.multiSection.formatInfoPopover.bankHtmlContent(BankId.cryptoCom)).toBeVisible();
    });
  });
});
