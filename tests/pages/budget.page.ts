import { Page } from '@fixtures';
import { BasePage } from './base.page';

export class BudgetPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  locators = {
    header: {
      title: () => this.getLocatorSource().getByTestId('app-title'),
      subtitle: () => this.getLocatorSource().getByTestId('app-subtitle'),
    },
    intro: {
      heading: () => this.getLocatorSource().getByTestId('intro-header'),
      description: () => this.getLocatorSource().getByTestId('intro-desc'),
    },
    multiFile: {
      section: () => this.getLocatorSource().getByTestId('multi-file-section'),
      header: () => this.locators.multiFile.section().getByTestId('header'),
      convertAllButton: () => this.locators.multiFile.section().getByTestId('convert-all-button'),
      successAlert: () => this.locators.multiFile.section().getByTestId('success-alert'),
      errorAlert: () => this.locators.multiFile.section().getByTestId('error-alert'),
      activoBank: {
        section: () => this.locators.multiFile.section().getByTestId('bank-ActivoBank-card'),
        fileInput: () => this.locators.multiFile.activoBank.section().getByTestId('file-input'),
        selectedFile: () => this.locators.multiFile.activoBank.section().getByTestId('selected-file-label'),
      },
      creditoAgricola: {
        section: () => this.locators.multiFile.section().getByTestId('bank-CreditoAgricola-card'),
        fileInput: () => this.locators.multiFile.creditoAgricola.section().getByTestId('file-input'),
        selectedFile: () => this.locators.multiFile.creditoAgricola.section().getByTestId('selected-file-label'),
      },
      cryptoCom: {
        section: () => this.locators.multiFile.section().getByTestId('bank-CryptoCom-card'),
        fileInput: () => this.locators.multiFile.cryptoCom.section().getByTestId('file-input'),
        selectedFile: () => this.locators.multiFile.cryptoCom.section().getByTestId('selected-file-label'),
      },
      formatInfo: {
        button: () => this.locators.multiFile.section().getByTestId('format-info-button'),
        popover: {
          section: () => this.getLocatorSource().getByTestId('format-info-popover'),
          header: () => this.locators.multiFile.formatInfo.popover.section().getByTestId('header'),
          closeButton: () => this.locators.multiFile.formatInfo.popover.section().getByTestId('close-button'),
          bankSection: (bankId: string) =>
            this.locators.multiFile.formatInfo.popover.section().getByTestId(`bank-${bankId}-section`),
          fileExtension: (bankId: string) => {
            const bankSection = this.locators.multiFile.formatInfo.popover
              .section()
              .getByTestId(`bank-${bankId}-section`);
            return bankSection.getByTestId('file-extension-badge');
          },
          htmlExample: (bankId: string) => {
            const bankSection = this.locators.multiFile.formatInfo.popover
              .section()
              .getByTestId(`bank-${bankId}-section`);
            return bankSection.getByTestId('example-html');
          },
        },
      },
    },
    singleFile: {
      section: () => this.getLocatorSource().getByTestId('single-file-section'),
      header: () => this.locators.singleFile.section().getByTestId('main-header'),
      activoBank: {
        section: () => this.locators.singleFile.section().getByTestId('bank-ActivoBank-card'),
        fileInput: () => this.locators.singleFile.activoBank.section().getByTestId('file-input'),
        convertButton: () => this.locators.singleFile.activoBank.section().getByTestId('convert-button'),
        successAlert: () => this.locators.singleFile.activoBank.section().getByTestId('success-alert'),
        errorAlert: () => this.locators.singleFile.activoBank.section().getByTestId('error-alert'),
        formatInfo: {
          button: () => this.locators.singleFile.activoBank.section().getByTestId('format-info-button'),
          popover: {
            section: () => this.getLocatorSource().getByTestId('format-info-popover'),
            header: () => this.locators.singleFile.activoBank.formatInfo.popover.section().getByTestId('header'),
            closeButton: () =>
              this.locators.singleFile.activoBank.formatInfo.popover.section().getByTestId('close-button'),
            fileExtension: () =>
              this.locators.singleFile.activoBank.formatInfo.popover.section().getByTestId('file-extension-badge'),
            htmlExample: () =>
              this.locators.singleFile.activoBank.formatInfo.popover.section().getByTestId('example-html'),
          },
        },
      },
      creditoAgricola: {
        section: () => this.locators.singleFile.section().getByTestId('bank-CreditoAgricola-card'),
        fileInput: () => this.locators.singleFile.creditoAgricola.section().getByTestId('file-input'),
        convertButton: () => this.locators.singleFile.creditoAgricola.section().getByTestId('convert-button'),
        successAlert: () => this.locators.singleFile.creditoAgricola.section().getByTestId('success-alert'),
        errorAlert: () => this.locators.singleFile.creditoAgricola.section().getByTestId('error-alert'),
        formatInfo: {
          button: () => this.locators.singleFile.creditoAgricola.section().getByTestId('format-info-button'),
          popover: {
            section: () => this.getLocatorSource().getByTestId('format-info-popover'),
            header: () => this.locators.singleFile.creditoAgricola.formatInfo.popover.section().getByTestId('header'),
            closeButton: () =>
              this.locators.singleFile.creditoAgricola.formatInfo.popover.section().getByTestId('close-button'),
            fileExtension: () =>
              this.locators.singleFile.creditoAgricola.formatInfo.popover.section().getByTestId('file-extension-badge'),
            htmlExample: () =>
              this.locators.singleFile.creditoAgricola.formatInfo.popover.section().getByTestId('example-html'),
          },
        },
      },
      cryptoCom: {
        section: () => this.locators.singleFile.section().getByTestId('bank-CryptoCom-card'),
        fileInput: () => this.locators.singleFile.cryptoCom.section().getByTestId('file-input'),
        convertButton: () => this.locators.singleFile.cryptoCom.section().getByTestId('convert-button'),
        successAlert: () => this.locators.singleFile.cryptoCom.section().getByTestId('success-alert'),
        errorAlert: () => this.locators.singleFile.cryptoCom.section().getByTestId('error-alert'),
        formatInfo: {
          button: () => this.locators.singleFile.cryptoCom.section().getByTestId('format-info-button'),
          popover: {
            section: () => this.getLocatorSource().getByTestId('format-info-popover'),
            header: () => this.locators.singleFile.cryptoCom.formatInfo.popover.section().getByTestId('header'),
            closeButton: () =>
              this.locators.singleFile.cryptoCom.formatInfo.popover.section().getByTestId('close-button'),
            fileExtension: () =>
              this.locators.singleFile.cryptoCom.formatInfo.popover.section().getByTestId('file-extension-badge'),
            htmlExample: () =>
              this.locators.singleFile.cryptoCom.formatInfo.popover.section().getByTestId('example-html'),
          },
        },
      },
    },
    footer: () => this.getLocatorSource().getByTestId('footer'),
  };

  async goTo() {
    await this.page.goto('/');
  }

  async goToMultiSection() {
    await this.page.goto('/');
    await this.page.getByTestId('tab-multi').click();
  }

  async goToSingleSection() {
    await this.page.goto('/');
    await this.page.getByTestId('tab-single').click();
  }
}
