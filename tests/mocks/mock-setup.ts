import { Page } from '@playwright/test';

export class MockSetup {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setMockMode() {
    await this.page.route('**budget**', (route) => {
      route.abort();
    });
  }
}
