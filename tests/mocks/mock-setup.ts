import { Page } from '@playwright/test';
import { generateAllBanksConfigResponse } from './responses/generate-all-banks-config.response';

export class MockSetup {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setMockMode() {
    // Abort all budget API calls by default
    await this.page.route('**budget**', (route) => {
      route.abort();
    });
    // Always fulfill /file-config/all so the page can render its bank list
    // (registered after catch-all so it takes precedence)
    await this.page.route('**/file-config/all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateAllBanksConfigResponse()),
      });
    });
  }
}
