export function generateCategoryRulesResponse() {
  return [
    { id: '1', keyword: 'restaurant', type: 'Expense', category: 'Food', subCategory: 'Restaurant' },
    { id: '2', keyword: 'grocery', type: 'Expense', category: 'Food', subCategory: 'Grocery' },
    { id: '3', keyword: 'salary', type: 'Income', category: 'Income', subCategory: 'Salary' },
    { id: '4', keyword: 'transport', type: 'Expense', category: 'Transport', subCategory: 'Public Transport' },
    { id: '5', keyword: 'netflix', type: 'Expense', category: 'Entertainment', subCategory: 'Subscriptions' },
  ];
}
