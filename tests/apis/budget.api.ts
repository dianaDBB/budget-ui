import { BankId } from '@data-models/bank-id';

export class BudgetApi {
  static baseUrl(): string {
    return `${process.env.VITE_API_URL}`;
  }

  static generateSingleFileUrl(bankId: BankId): string {
    return `${this.baseUrl()}/file/${bankId}`;
  }

  static getBankFormatUrl(bankId: BankId): string {
    return `${this.baseUrl()}/format/${bankId}`;
  }
}
