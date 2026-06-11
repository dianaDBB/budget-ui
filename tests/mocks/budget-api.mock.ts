import { BudgetApi } from '@apis/budget.api';
import { MockSetup } from '@mocks/mock-setup';
import { BasePage } from '@pages/base.page';
import { generateFileResponse } from './responses/generate-file.response';

export class BudgetApiMock extends MockSetup {
  constructor(public readonly basePage: BasePage) {
    super(basePage.page);
  }

  async mockGenerateActivoBankFile(params: { success: boolean }) {
    const requestUrl = BudgetApi.generateActivoBankFileUrl();
    const mockedResponse = generateFileResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'POST',
        responseStatus: params.success ? 200 : 500,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="activo-bank-mock.xlsx"',
        },
      },
    ]);
  }

  async mockGenerateCreditoAgricolaFile(params: { success: boolean }) {
    const requestUrl = BudgetApi.generateCreditoAgricolaFileUrl();
    const mockedResponse = generateFileResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'POST',
        responseStatus: params.success ? 200 : 500,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="credito-agricola-mock.xlsx"',
        },
      },
    ]);
  }

  async mockGenerateCryptoComFile(params: { success: boolean }) {
    const requestUrl = BudgetApi.generateCryptoComFileUrl();
    const mockedResponse = generateFileResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'POST',
        responseStatus: params.success ? 200 : 500,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="crypto-com-mock.xlsx"',
        },
      },
    ]);
  }

  async mockGenerateAllFiles(params: { success: boolean }) {
    const requestUrl = BudgetApi.generateAllFilesUrl();
    const mockedResponse = generateFileResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'POST',
        responseStatus: params.success ? 200 : 500,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="all-files-mock.xlsx"',
        },
      },
    ]);
  }
}
