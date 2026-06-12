import { BankId } from '@data-models/bank-id';
import { test } from '@fixtures';

test.describe('Setup', () => {
  test('API should be accessible', async ({ budgetApi }) => {
    await test.step('Do a request to wake up the API', async () => {
      await budgetApi.getFileFormat(BankId.activoBank);
    });
  });
});
