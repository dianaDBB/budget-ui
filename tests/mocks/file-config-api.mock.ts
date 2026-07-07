import { FileaConfigApi } from '@apis/file-config.api';
import { MockSetup } from './mock-setup';
import { BasePage } from '@pages/base.page';
import { getAllFileConfigsResponse } from './responses/generateFormatResponse.response';

export class FileConfigApiApiMock extends MockSetup {
  constructor(public readonly basePage: BasePage) {
    super(basePage.page);
  }

  async mockGetAll() {
    const requestUrl = FileaConfigApi.getAllUrl();
    const mockedResponse = getAllFileConfigsResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'GET',
        responseStatus: 200,
      },
    ]);
  }
}
