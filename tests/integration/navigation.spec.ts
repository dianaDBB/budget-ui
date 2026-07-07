import { test, expect } from '@fixtures';

test.describe('Navigation', () => {
  test.beforeEach(async ({ mockSetup, fileConfigApiApiMock }) => {
    await mockSetup.setMockMode();
    await fileConfigApiApiMock.mockGetAll();
  });

  test('All tabs are available and navigable', async ({ budgetPage, convertAndCategorizePage, rulesPage }) => {
    await test.step('Open the application homepage', async () => {
      await budgetPage.goTo();
      await expect(budgetPage.locators.header()).toHaveText('Budget');
      await expect(budgetPage.locators.subtitle()).toHaveText('Unify different bank extracts to a standardized format');
    });

    await test.step('Tab "Convert & Categorize" is available', async () => {
      await expect(convertAndCategorizePage.baseLocators.tab('Convert & Categorize')).toBeVisible();
      await convertAndCategorizePage.openTab('Convert & Categorize');
      await expect(convertAndCategorizePage.locators.fileInputs.byIndex(0)).toBeVisible();
      await expect(convertAndCategorizePage.locators.generatePreviewButton()).toBeVisible();
    });

    await test.step('Tab "Rules" is available', async () => {
      await expect(rulesPage.baseLocators.tab('Rules')).toBeVisible();
      await rulesPage.openTab('Rules');
      await expect(rulesPage.locators.rules.table()).toBeVisible();
      await expect(rulesPage.locators.addRuleButton()).toBeVisible();
      await expect(rulesPage.locators.saveRulesButton()).toBeVisible();
    });
  });
});
