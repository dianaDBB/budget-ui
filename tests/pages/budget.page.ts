import { Page } from '@fixtures';
import { BasePage } from './base.page';
import { BankId } from '@data-models/bank-id';

export class BudgetPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  locators = {
    header: {
      title: () => {
        return this.getLocatorSource().getByTestId('app-title');
      },
      subtitle: () => {
        return this.getLocatorSource().getByTestId('app-subtitle');
      },
    },
    intro: {
      heading: () => {
        return this.getLocatorSource().getByTestId('intro-heading');
      },
      description: () => {
        return this.getLocatorSource().getByTestId('intro-description');
      },
    },
    multiSection: {
      sectionHeading: () => {
        return this.getLocatorSource().getByTestId('multi-section-heading');
      },
      activoBankFileInput: () => {
        return this.getLocatorSource().getByTestId('multiple-file-input-activoBank');
      },
      creditoAgricolaFileInput: () => {
        return this.getLocatorSource().getByTestId('multiple-file-input-creditoAgricola');
      },
      cryptoComFileInput: () => {
        return this.getLocatorSource().getByTestId('multiple-file-input-cryptoCom');
      },
      activoBankFileDisplay: () => {
        return this.getLocatorSource().getByTestId('multiple-file-display-activoBank');
      },
      creditoAgricolaFileDisplay: () => {
        return this.getLocatorSource().getByTestId('multiple-file-display-creditoAgricola');
      },
      cryptoComFileDisplay: () => {
        return this.getLocatorSource().getByTestId('multiple-file-display-cryptoCom');
      },
      convertAllButton: () => {
        return this.getLocatorSource().getByTestId('convert-all-button');
      },
      successAlert: () => {
        return this.getLocatorSource().getByTestId('multi-section-success');
      },
      errorAlert: () => {
        return this.getLocatorSource().getByTestId('multi-section-error');
      },
      formatInfoButton: () => {
        return this.getLocatorSource().getByTestId('multi-section-format-info-button');
      },
      formatInfoPopover: {
        header: () => {
          return this.getLocatorSource().getByTestId('multi-section-format-info-header');
        },
        closeButton: () => {
          return this.getLocatorSource().getByTestId('multi-section-format-info-close-button');
        },
        bankSection: (bankId: BankId) => {
          return this.getLocatorSource().getByTestId(`multi-section-bank-format-section-${bankId}`);
        },
        bankBadge: (bankId: BankId) => {
          return this.getLocatorSource().getByTestId(`multi-section-bank-format-badge-${bankId}`);
        },
        bankHtmlContent: (bankId: BankId) => {
          return this.getLocatorSource().getByTestId(`multi-section-bank-format-html-${bankId}`);
        },
      },
    },
    singleSection: {
      sectionHeading: () => {
        return this.getLocatorSource().getByTestId('single-section-main-heading');
      },
      activoBank: {
        fileInput: () => {
          return this.getLocatorSource().getByTestId('single-file-input-activoBank');
        },
        convertButton: () => {
          return this.getLocatorSource().getByTestId('convert-button-activoBank');
        },
        successAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-success-activoBank');
        },
        errorAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-error-activoBank');
        },
        formatInfoButton: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-button-activoBank');
        },
      },
      creditoAgricola: {
        fileInput: () => {
          return this.getLocatorSource().getByTestId('single-file-input-creditoAgricola');
        },
        convertButton: () => {
          return this.getLocatorSource().getByTestId('convert-button-creditoAgricola');
        },
        successAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-success-creditoAgricola');
        },
        errorAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-error-creditoAgricola');
        },
        formatInfoButton: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-button-creditoAgricola');
        },
      },
      cryptoCom: {
        fileInput: () => {
          return this.getLocatorSource().getByTestId('single-file-input-cryptoCom');
        },
        convertButton: () => {
          return this.getLocatorSource().getByTestId('convert-button-cryptoCom');
        },
        successAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-success-cryptoCom');
        },
        errorAlert: () => {
          return this.getLocatorSource().getByTestId('conversion-error-cryptoCom');
        },
        formatInfoButton: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-button-cryptoCom');
        },
      },
      formatInfoPopover: {
        header: (bankId: BankId) => {
          return this.getLocatorSource().getByTestId(`single-file-format-info-header-${bankId}`);
        },
        closeButton: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-close-button');
        },
        badge: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-badge');
        },
        htmlContent: () => {
          return this.getLocatorSource().getByTestId('single-file-format-info-html');
        },
      },
    },
    footer: () => {
      return this.getLocatorSource().getByTestId('app-footer');
    },
  };

  async goTo() {
    await this.page.goto('/');
  }
}
