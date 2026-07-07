import { test as base, expect, Locator } from '@playwright/test';
import { MockSetup } from '@mocks/mock-setup';
import { BaseApi } from '@apis/base.api';
import { BudgetPage } from '@pages/budget.page';
import { ConvertAndCategorizePage } from '@pages/convert-and-categorize.page';
import { RulesPage } from '@pages/rules.page';
import { FileConfigApiApiMock } from '@mocks/file-config-api.mock';
import { BasePage } from '@pages/base.page';

export interface BaseFixtures {
  mockSetup: MockSetup;
  baseApi: BaseApi;
  basePage: BasePage;

  fileConfigApiApiMock: FileConfigApiApiMock;

  budgetPage: BudgetPage;
  convertAndCategorizePage: ConvertAndCategorizePage;
  rulesPage: RulesPage;
}

export const test = base.extend<BaseFixtures>({
  mockSetup: async ({ page }, use) => {
    const mockSetup = new MockSetup(page);
    await use(mockSetup);
  },

  baseApi: async ({ request }, use) => {
    const baseApi = new BaseApi(request);
    await use(baseApi);
  },

  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  fileConfigApiApiMock: async ({ basePage }, use) => {
    const fileConfigApiApiMock = new FileConfigApiApiMock(basePage);
    await use(fileConfigApiApiMock);
  },

  budgetPage: async ({ page }, use) => {
    const budgetPage = new BudgetPage(page);
    await use(budgetPage);
  },

  convertAndCategorizePage: async ({ page }, use) => {
    const convertAndCategorizePage = new ConvertAndCategorizePage(page);
    await use(convertAndCategorizePage);
  },

  rulesPage: async ({ page }, use) => {
    const rulesPage = new RulesPage(page);
    await use(rulesPage);
  },
});

expect.extend({
  async toHaveCountGreaterThanOrEqual(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = 'toHaveCountGreaterThanOrEqual';
    let pass: boolean;
    let received: number | undefined;

    try {
      await expect(async () => {
        received = await locator.count();
        expect(received).toBeGreaterThanOrEqual(expected);
      }).toPass({ timeout: options?.timeout || 5000 });
      pass = true;
    } catch (e: unknown) {
      pass = false;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: >= ${this.isNot ? 'not' : ''}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: >= ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`;

    return { message, pass, name: assertionName, expected, actual: received };
  },

  async toHaveCountGreaterThan(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = 'toHaveCountGreaterThan';
    let pass: boolean;
    let received: number | undefined;

    try {
      await expect(async () => {
        received = await locator.count();
        expect(received).toBeGreaterThan(expected);
      }).toPass({ timeout: options?.timeout || 5000 });
      pass = true;
    } catch (e: unknown) {
      pass = false;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: > ${this.isNot ? 'not' : ''}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: > ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`;

    return { message, pass, name: assertionName, expected, actual: received };
  },

  async toHaveCountLessThanOrEqual(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = 'toHaveCountLessThanOrEqual';
    let pass: boolean;
    let received: number | undefined;

    try {
      await expect(async () => {
        received = await locator.count();
        expect(received).toBeLessThanOrEqual(expected);
      }).toPass({ timeout: options?.timeout || 5000 });
      pass = true;
    } catch (e: unknown) {
      pass = false;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: <= ${this.isNot ? 'not' : ''}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: <= ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`;

    return { message, pass, name: assertionName, expected, actual: received };
  },

  async toHaveCountLessThan(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = 'toHaveCountLessThan';
    let pass: boolean;
    let received: number | undefined;

    try {
      await expect(async () => {
        received = await locator.count();
        expect(received).toBeLessThan(expected);
      }).toPass({ timeout: options?.timeout || 5000 });
      pass = true;
    } catch (e: unknown) {
      pass = false;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: < ${this.isNot ? 'not' : ''}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: < ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`;

    return { message, pass, name: assertionName, expected, actual: received };
  },
});

export { expect } from '@playwright/test';
export type { Page, Locator, APIRequestContext, Request, Response } from '@playwright/test';
