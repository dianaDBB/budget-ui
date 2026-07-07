import { MockParams } from '@data-models/mock';
import { Page, FrameLocator, Locator } from '@playwright/test';

import chai from 'chai';
import jsonSchema from 'chai-json-schema';
import path from 'path';

chai.use(jsonSchema);

export class BasePage {
  constructor(public readonly page: Page, public readonly frameLocator?: FrameLocator) {}

  public getLocatorSource(): Page | FrameLocator {
    return this.frameLocator || this.page;
  }

  baseLocators = {
    tab: (name: string) => {
      return this.getLocatorSource().getByTestId('tab').filter({ hasText: name });
    },
  };

  async openTab(name: string): Promise<void> {
    await this.baseLocators.tab(name).click();
  }

  validateMock(requestMethod: string, requestUrl: string, mockedResponse: any, schema: any): void {
    const errorMessage = `\n\n\t${requestMethod} ${requestUrl}\n\tMocked response is not valid. Please check the mock response and/or the response schema.\n\n\tDETAILS`;
    chai.expect(mockedResponse, errorMessage).to.be.jsonSchema(schema);
  }

  async mockRequest(url: string, responsesPerMethod: Array<MockParams>): Promise<void> {
    let mocked = false;

    await this.page.route(`**${url}`, async (route) => {
      for (const responsePerMethod of responsesPerMethod) {
        const mockedResponse = structuredClone(responsePerMethod.response);

        if (responsePerMethod.schema) {
          this.validateMock(responsePerMethod.method, url, mockedResponse, responsePerMethod.schema);
        }

        let requestPayloadFlag: boolean = true;
        if (responsePerMethod.requestPayload) {
          requestPayloadFlag = route.request().postData() == JSON.stringify(responsePerMethod.requestPayload);
        }

        if (route.request().method() === responsePerMethod.method && requestPayloadFlag) {
          await route.fulfill({
            status: responsePerMethod.responseStatus,
            contentType: 'application/json',
            body: JSON.stringify(mockedResponse),
          });
          mocked = true;
        }
      }

      if (!mocked) {
        await route.abort();
      }
    });
  }

  async clickAndUploadFile(locator: Locator, fileName: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await locator.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.resolve('tests/resources', fileName));
  }
}
