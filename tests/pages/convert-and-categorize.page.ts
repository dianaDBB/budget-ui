import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PreviewLine } from '@data-models/preview.data';
import { test } from '@fixtures';

export class ConvertAndCategorizePage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  locators = {
    fileInputs: {
      all: () => {
        return this.getLocatorSource().getByTestId('file-input');
      },
      byIndex: (index: number) => {
        return this.locators.fileInputs.all().nth(index);
      },
    },
    generatePreviewButton: () => {
      return this.getLocatorSource().getByTestId('generatePreviewBtn');
    },
    preview: {
      table: () => {
        return this.getLocatorSource().getByTestId('preview-table');
      },
      rows: () => {
        return this.locators.preview.table().locator('tbody').locator('tr');
      },
      row: (index: number) => {
        return this.locators.preview.rows().nth(index);
      },
      bank: (row: Locator) => {
        return row.locator('td').nth(0).locator('select');
      },
      date: (row: Locator) => {
        return row.locator('td').nth(1).locator('input');
      },
      description: (row: Locator) => {
        return row.locator('td').nth(2).locator('input');
      },
      amount: (row: Locator) => {
        return row.locator('td').nth(3).locator('input');
      },
      type: (row: Locator) => {
        return row.locator('td').nth(4).locator('select');
      },
      category: (row: Locator) => {
        return row.locator('td').nth(5).locator('select');
      },
      subcategory: (row: Locator) => {
        return row.locator('td').nth(6).locator('select');
      },
      addButton: (row: Locator) => {
        return row.locator('td').nth(7).locator('button');
      },
    },
    generateExcelButton: () => {
      return this.getLocatorSource().getByTestId('generateExcelBtn');
    },
  };

  async goTo(): Promise<void> {
    await this.page.goto('/');
    await this.openTab('Convert & Categorize');
    await expect(this.locators.generatePreviewButton()).toBeVisible();
  }

  async uploadFile(index: number, fileName = 'sample.csv'): Promise<void> {
    const input = this.locators.fileInputs.byIndex(index);
    await this.clickAndUploadFile(input, fileName);
  }

  async checkPreview(expectedPreview: PreviewLine[]) {
    await test.step(`The preview has ${expectedPreview.length} row(s)`, async () => {
      await expect(this.locators.preview.rows()).toHaveCount(expectedPreview.length);
    });

    for (let index = 0; index < expectedPreview.length; index++) {
      const previewLine = expectedPreview[index];
      const row = this.locators.preview.row(index);

      const bankName = previewLine.bankName;
      await test.step(`Row #${index} - "Bank" value is "${bankName}"`, async () => {
        await expect(this.locators.preview.bank(row)).toHaveValue(bankName);
      });

      const date = previewLine.date;
      await test.step(`Row #${index} - "Date" value is "${date}"`, async () => {
        await expect(this.locators.preview.date(row)).toHaveValue(date);
      });

      const description = previewLine.description;
      await test.step(`Row #${index} - "Description" value is "${description}"`, async () => {
        await expect(this.locators.preview.description(row)).toHaveValue(description);
      });

      const amount = previewLine.amount.toFixed(2);
      await test.step(`Row #${index} - "Amount" value is "${amount}"`, async () => {
        await expect(this.locators.preview.amount(row)).toHaveValue(amount);
      });

      const type = previewLine.type;
      await test.step(`Row #${index} - "Type" value is "${type}"`, async () => {
        await expect(this.locators.preview.type(row)).toHaveValue(type.toString());
      });

      const category = previewLine.category;
      await test.step(`Row #${index} - "Category" value is "${category}"`, async () => {
        await expect(this.locators.preview.category(row)).toHaveValue(category.toString());
      });

      const subcategory = previewLine.subcategory;
      await test.step(`Row #${index} - "Subcategory" value is "${subcategory}"`, async () => {
        await expect(this.locators.preview.subcategory(row)).toHaveValue(subcategory.toString());
      });
    }
  }
}
