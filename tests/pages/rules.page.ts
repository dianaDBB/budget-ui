import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RulesPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  locators = {
    addRuleButton: () => {
      return this.getLocatorSource().getByTestId('add-rule');
    },
    saveRulesButton: () => {
      return this.getLocatorSource().getByTestId('save-rules');
    },
    rules: {
      table: () => {
        return this.getLocatorSource().getByTestId('rules-table');
      },
      rows: () => {
        return this.locators.rules.table().getByTestId('rule-row');
      },
      row: (index: number) => {
        return this.locators.rules.rows().nth(index);
      },
      keyword: (row: Locator) => {
        return row.getByTestId('keyword-input');
      },
      type: (row: Locator) => {
        return row.getByTestId('type-select');
      },
      typeOption: (row: Locator) => {
        return row.getByTestId('type-option');
      },
      category: (row: Locator) => {
        return row.getByTestId('category-select');
      },
      subcategory: (row: Locator) => {
        return row.getByTestId('subcategory-select');
      },
    },
  };

  async goTo(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await this.openTab('Rules');
    await expect(this.locators.addRuleButton()).toBeVisible();
  }

  async addRule(keyword: string, type: string, category: string, subcategory: string): Promise<void> {
    await this.locators.addRuleButton().click();

    const row = this.locators.rules.rows().last();
    await this.locators.rules.keyword(row).fill(keyword);
    await this.locators.rules.type(row).selectOption({ label: type });
    await this.locators.rules.category(row).selectOption({ label: category });
    await this.locators.rules.subcategory(row).selectOption({ label: subcategory });
  }
}
