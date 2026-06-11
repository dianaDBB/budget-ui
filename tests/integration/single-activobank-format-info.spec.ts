import { BankId } from '@data-models/bank-id';
import { test, expect } from '@fixtures';

test.describe('Format Info — Single File Conversion', () => {
  test.beforeEach(async ({ mockSetup, budgetMock }) => {
    await mockSetup.setMockMode();
    await budgetMock.mockGetBankFormat({ bankId: BankId.activoBank });
  });

  test('should open the format popover for ActivoBank when clicking the info button', async ({ budgetPage }) => {
    await test.step('Navigate to the Budget UI application', async () => {
      await budgetPage.goTo();
    });

    await test.step('Click the info icon button on the ActivoBank card', async () => {
      await budgetPage.locators.singleSection.activoBank.formatInfoButton().click();
    });

    await test.step('Verify the format popover header is visible and contains the bank name', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.header(BankId.activoBank)).toBeVisible();
    });

    await test.step('Verify the file format badge shows XLSX', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.badge()).toContainText('XLSX');
    });

    await test.step('Verify the HTML example content is rendered', async () => {
      await expect(budgetPage.locators.singleSection.formatInfoPopover.htmlContent()).toBeVisible();
    });
  });
});
