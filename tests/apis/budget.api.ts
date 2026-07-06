import { BankId } from '@data-models/bank-id';
import { BaseApi } from '@apis/base.api';
import { APIRequestContext } from 'playwright-core';

export class BudgetApi extends BaseApi {
  constructor(public readonly request: APIRequestContext) {
    super(request, '.env.production');
  }

  /** *************************************************** URLs **************************************************** **/

  static baseUrl(): string {
    return `${process.env.VITE_API_URL}`;
  }

  static generateSingleFileUrl(bankId: BankId): string {
    return `${BudgetApi.baseUrl()}/file/${bankId}`;
  }

  static generateAllFilesUrl(): string {
    return `${BudgetApi.baseUrl()}/file/all`;
  }

  static getBankFormatUrl(bankId: BankId): string {
    return `${BudgetApi.baseUrl()}/file-config/${bankId}`;
  }

  static getAllBankConfigsUrl(): string {
    return `${BudgetApi.baseUrl()}/file-config/all`;
  }

  /** ************************************************** ACTIONS ************************************************** **/

  async getFileFormat(bankId: BankId): Promise<any> {
    const url = BudgetApi.getBankFormatUrl(bankId);
    const response = await this.executeValidatedGet(url);

    return await response.json();
  }
}
