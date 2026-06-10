import { Page } from '@fixtures';

export class BudgetPage {
  constructor(public page: Page) {}

  async goTo() {
    await this.page.goto('/');
  }

  locators = {
    header: {
      title: () => {
        return this.page.getByRole('heading', { name: 'Budget', exact: true });
      },
      subtitle: () => {
        return this.page.getByText('Unify different bank extracts to a standardized format');
      },
    },
    intro: {
      heading: () => {
        return this.page.getByRole('heading', { name: 'Welcome to Budget Application' });
      },
      description: () => {
        return this.page.getByText('Convert different extract files from your bank account');
      },
    },
    multiSection: {
      sectionHeading: () => {
        return this.page.getByRole('heading', { name: 'Multiple File Conversion', exact: true });
      },
      cardHeading: () => {
        return this.page.getByRole('heading', { name: 'Convert Multiple Files' });
      },
      activoBankFileInput: () => {
        return this.page.locator('#file-activoBank');
      },
      creditoAgricolaFileInput: () => {
        return this.page.locator('#file-creditoAgricola');
      },
      cryptoComFileInput: () => {
        return this.page.locator('#file-cryptoCom');
      },
      activoBankFileDisplay: () => {
        return this.page.locator('.multi-converter-card .file-input-group').nth(0).locator('.file-display');
      },
      creditoAgricolaFileDisplay: () => {
        return this.page.locator('.multi-converter-card .file-input-group').nth(1).locator('.file-display');
      },
      cryptoComFileDisplay: () => {
        return this.page.locator('.multi-converter-card .file-input-group').nth(2).locator('.file-display');
      },
      convertAllButton: () => {
        return this.page.getByRole('button', { name: 'Convert All' });
      },
      successAlert: () => {
        return this.page.locator('.multi-converter-card .alert-success');
      },
      errorAlert: () => {
        return this.page.locator('.multi-converter-card .alert-error');
      },
    },
    singleSection: {
      sectionHeading: () => {
        return this.page.getByRole('heading', { name: 'Single File Conversion', exact: true });
      },
      activoBank: {
        fileInput: () => {
          return this.page.locator('#file-input-activoBank');
        },
        fileLabel: () => {
          return this.page.locator('label[for="file-input-activoBank"]');
        },
        convertButton: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'ActivoBank', exact: true }) })
            .getByRole('button', { name: 'Convert' });
        },
        successAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'ActivoBank', exact: true }) })
            .locator('.alert-success');
        },
        errorAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'ActivoBank', exact: true }) })
            .locator('.alert-error');
        },
      },
      creditoAgricola: {
        fileInput: () => {
          return this.page.locator('#file-input-creditoAgricola');
        },
        fileLabel: () => {
          return this.page.locator('label[for="file-input-creditoAgricola"]');
        },
        convertButton: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crédito Agrícola', exact: true }) })
            .getByRole('button', { name: 'Convert' });
        },
        successAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crédito Agrícola', exact: true }) })
            .locator('.alert-success');
        },
        errorAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crédito Agrícola', exact: true }) })
            .locator('.alert-error');
        },
      },
      cryptoCom: {
        fileInput: () => {
          return this.page.locator('#file-input-cryptoCom');
        },
        fileLabel: () => {
          return this.page.locator('label[for="file-input-cryptoCom"]');
        },
        convertButton: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crypto.com', exact: true }) })
            .getByRole('button', { name: 'Convert' });
        },
        successAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crypto.com', exact: true }) })
            .locator('.alert-success');
        },
        errorAlert: () => {
          return this.page
            .locator('.converter-card')
            .filter({ has: this.page.getByRole('heading', { name: 'Crypto.com', exact: true }) })
            .locator('.alert-error');
        },
      },
    },
    footer: () => {
      return this.page.getByText('© 2024 Budget. Process your bank statements with ease.');
    },
  };
}
