import { PreviewData } from '@data-models/preview.data';
import { test, expect } from '@fixtures';

test.describe('Convert & Categorize', () => {
  test('Preview from an uploaded file', async ({ convertAndCategorizePage }) => {
    await test.step('Open the "Convert & Categorize" tab', async () => {
      await convertAndCategorizePage.goTo();
    });

    await test.step('Select first supported bank file and upload it', async () => {
      await convertAndCategorizePage.uploadFile(0, 'activoBank.xlsx');
      await expect(convertAndCategorizePage.locators.fileInputs.byIndex(0)).toHaveValue(
        'C:\\fakepath\\activoBank.xlsx',
      );
    });

    await test.step('Select second supported bank file and upload it', async () => {
      await convertAndCategorizePage.uploadFile(1, 'creditoAgricola.xlsx');
      await expect(convertAndCategorizePage.locators.fileInputs.byIndex(1)).toHaveValue(
        'C:\\fakepath\\creditoAgricola.xlsx',
      );
    });

    await test.step('Select third supported bank file and upload it', async () => {
      await convertAndCategorizePage.uploadFile(2, 'cryptoCom.csv');
      await expect(convertAndCategorizePage.locators.fileInputs.byIndex(2)).toHaveValue('C:\\fakepath\\cryptoCom.csv');
    });

    await test.step('Click "Generate Preview"', async () => {
      await convertAndCategorizePage.locators.generatePreviewButton().click();
    });

    await test.step('A table with all the file results appear', async () => {
      await expect(convertAndCategorizePage.locators.preview.table()).toBeVisible();
      await convertAndCategorizePage.checkPreview(PreviewData.all());
    });

    await test.step('And the "Generate Excel" button is available', async () => {
      await expect(convertAndCategorizePage.locators.generateExcelButton()).toBeEnabled();
    });

    await test.step('Click "Generate Excel" button and verify a file download is triggered', async () => {
      const downloadPromise = convertAndCategorizePage.page.waitForEvent('download');
      await convertAndCategorizePage.locators.generateExcelButton().click();
      await downloadPromise;
    });
  });
});
