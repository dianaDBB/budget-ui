import { BasePage } from './base.page';
import { expect, Page } from '@playwright/test';

export class BudgetPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  locators = {
    header: () => {
      return this.getLocatorSource().getByTestId('app-header');
    },
    subtitle: () => {
      return this.getLocatorSource().getByTestId('app-subtitle');
    },
  };

  async goTo(): Promise<void> {
    await this.page.goto('/');
    await expect(this.locators.header()).toBeVisible();
  }
}
