import { BudgetApi } from '@apis/budget.api';
import { MockSetup } from '@mocks/mock-setup';
import { BasePage } from '@pages/base.page';
import { generateFileResponse } from './responses/generate-file.response';
import { generateFormatResponse } from './responses/generate-format.response';
import { BankId } from '@data-models/bank-id';

export class BudgetApiMock extends MockSetup {
  constructor(public readonly basePage: BasePage) {
    super(basePage.page);
  }

  async mockGenerateFile(params: { bankId: BankId; success: boolean }) {
    const requestUrl = BudgetApi.generateSingleFileUrl(params.bankId);
    const mockedResponse = generateFileResponse();

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'POST',
        responseStatus: params.success ? 200 : 500,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="mock.xlsx"',
        },
      },
    ]);
  }

  async mockGetBankFormat(params: { bankId: BankId }) {
    const requestUrl = BudgetApi.getBankFormatUrl(params.bankId);
    const mockedResponse = generateFormatResponse(params.bankId);

    await this.basePage.mockRequest(requestUrl, [
      {
        response: mockedResponse,
        method: 'GET',
        responseStatus: 200,
      },
    ]);
  }
}
