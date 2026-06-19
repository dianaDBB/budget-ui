export function generatePreviewResponse() {
  return [
    {
      date: '2024-01-01',
      description: 'Sample Transaction 1',
      amount: -10.0,
      bankName: 'ActivoBank',
      type: 'Expense',
      category: 'Food',
      subcategory: 'Restaurant',
    },
    {
      date: '2024-01-02',
      description: 'Sample Transaction 2',
      amount: 500.0,
      bankName: 'CreditoAgricola',
      type: 'Income',
      category: 'Income',
      subcategory: 'Salary',
    },
    {
      date: '2024-01-03',
      description: 'Sample Transaction 3',
      amount: -5.99,
      bankName: 'CryptoCom',
      type: 'Expense',
      category: 'Entertainment',
      subcategory: 'Subscriptions',
    },
  ];
}
