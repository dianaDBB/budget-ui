export interface PreviewLine {
  bankName: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  subcategory: string;
}

export class PreviewData {
  static activoBank(): PreviewLine[] {
    return [
      {
        bankName: 'ActivoBank',
        date: '2026-05-04',
        description: 'Test 1',
        amount: -10.0,
        type: 'Expense',
        category: '',
        subcategory: '',
      },
      {
        bankName: 'ActivoBank',
        date: '2026-05-04',
        description: 'This is a ALLEGIS GROUP description',
        amount: 50.0,
        type: 'Income',
        category: '',
        subcategory: '',
      },
    ];
  }

  static creditoAgricola(): PreviewLine[] {
    return [
      {
        bankName: 'CreditoAgricola',
        date: '2026-05-09',
        description: 'Test 2',
        amount: -5.0,
        type: 'Expense',
        category: '',
        subcategory: '',
      },
      {
        bankName: 'CreditoAgricola',
        date: '2026-05-11',
        description: 'continente but without caps',
        amount: -20.0,
        type: 'Expense',
        category: 'Home',
        subcategory: 'Groceries',
      },
    ];
  }

  static cryptoCom(): PreviewLine[] {
    return [
      {
        bankName: 'CryptoCom',
        date: '2026-05-11',
        description: 'Test 3',
        amount: 10.0,
        type: 'Income',
        category: '',
        subcategory: '',
      },
      {
        bankName: 'CryptoCom',
        date: '2026-05-11',
        description: 'this has someGALPin between',
        amount: -40.0,
        type: 'Expense',
        category: 'Cars',
        subcategory: 'Fuel',
      },
      {
        bankName: 'CryptoCom',
        date: '2026-05-11',
        description: 'Test 4',
        amount: -5.0,
        type: 'Expense',
        category: '',
        subcategory: '',
      },
      {
        bankName: 'CryptoCom',
        date: '2026-05-11',
        description: 'some TRF P/ DIANA BARBOSA ftest',
        amount: 60.0,
        type: 'TransferInHouse',
        category: '',
        subcategory: '',
      },
      {
        bankName: 'CryptoCom',
        date: '2026-05-11',
        description: 'Test 5',
        amount: -20.0,
        type: 'Expense',
        category: '',
        subcategory: '',
      },
    ];
  }

  static all(): PreviewLine[] {
    return [...PreviewData.activoBank(), ...PreviewData.creditoAgricola(), ...PreviewData.cryptoCom()];
  }
}
