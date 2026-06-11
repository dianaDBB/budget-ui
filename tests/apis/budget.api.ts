export class BudgetApi {
  static baseUrl(): string {
    return `${process.env.VITE_API_URL}`;
  }

  static generateActivoBankFileUrl(): string {
    return `${this.baseUrl()}/file/activoBank`;
  }

  static generateCreditoAgricolaFileUrl(): string {
    return `${this.baseUrl()}/file/creditoAgricola`;
  }

  static generateCryptoComFileUrl(): string {
    return `${this.baseUrl()}/file/cryptoCom`;
  }

  static generateAllFilesUrl(): string {
    return `${this.baseUrl()}/file/all`;
  }
}
