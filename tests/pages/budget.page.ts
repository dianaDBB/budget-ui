import { Page } from '@fixtures';

export class BudgetPage {
  constructor(public page: Page) {}

  locators = {
    header: {
      title: () => {
        return this.page.getByTestId('app-title');
      },
      subtitle: () => {
        return this.page.getByTestId('app-subtitle');
      },
    },
    intro: {
      heading: () => {
        return this.page.getByTestId('intro-heading');
      },
      description: () => {
        return this.page.getByTestId('intro-description');
      },
    },
    multiSection: {
      sectionHeading: () => {
        return this.page.getByTestId('multi-section-heading');
      },
      activoBankFileInput: () => {
        return this.page.getByTestId('multiple-file-input-activoBank');
      },
      creditoAgricolaFileInput: () => {
        return this.page.getByTestId('multiple-file-input-creditoAgricola');
      },
      cryptoComFileInput: () => {
        return this.page.getByTestId('multiple-file-input-cryptoCom');
      },
      activoBankFileDisplay: () => {
        return this.page.getByTestId('multiple-file-display-activoBank');
      },
      creditoAgricolaFileDisplay: () => {
        return this.page.getByTestId('multiple-file-display-creditoAgricola');
      },
      cryptoComFileDisplay: () => {
        return this.page.getByTestId('multiple-file-display-cryptoCom');
      },
      convertAllButton: () => {
        return this.page.getByTestId('convert-all-button');
      },
      successAlert: () => {
        return this.page.getByTestId('multi-section-success');
      },
      errorAlert: () => {
        return this.page.getByTestId('multi-section-error');
      },
    },
    singleSection: {
      sectionHeading: () => {
        return this.page.getByTestId('single-section-main-heading');
      },
      activoBank: {
        fileInput: () => {
          return this.page.getByTestId('single-file-input-activoBank');
        },
        convertButton: () => {
          return this.page.getByTestId('convert-button-activoBank');
        },
        successAlert: () => {
          return this.page.getByTestId('conversion-success-activoBank');
        },
        errorAlert: () => {
          return this.page.getByTestId('conversion-error-activoBank');
        },
      },
      creditoAgricola: {
        fileInput: () => {
          return this.page.getByTestId('single-file-input-creditoAgricola');
        },
        convertButton: () => {
          return this.page.getByTestId('convert-button-creditoAgricola');
        },
        successAlert: () => {
          return this.page.getByTestId('conversion-success-creditoAgricola');
        },
        errorAlert: () => {
          return this.page.getByTestId('conversion-error-creditoAgricola');
        },
      },
      cryptoCom: {
        fileInput: () => {
          return this.page.getByTestId('single-file-input-cryptoCom');
        },
        convertButton: () => {
          return this.page.getByTestId('convert-button-cryptoCom');
        },
        successAlert: () => {
          return this.page.getByTestId('conversion-success-cryptoCom');
        },
        errorAlert: () => {
          return this.page.getByTestId('conversion-error-cryptoCom');
        },
      },
    },
    footer: () => {
      return this.page.getByTestId('app-footer');
    },
  };

  async goTo() {
    await this.page.goto('/');
  }
}
