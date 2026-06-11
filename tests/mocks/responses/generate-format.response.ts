export function generateFormatResponse(bankId: string) {
  const htmlExample =
    '<table><tr><th>Date</th><th>Description</th><th>Amount</th></tr><tr><td>2024-01-01</td><td>Sample</td><td>-10.00</td></tr></table>';

  const configs: Record<string, { bankName: string; fileFormat: string; htmlExample: string }> = {
    activoBank: { bankName: 'ActivoBank', fileFormat: 'XLSX', htmlExample: htmlExample },
    creditoAgricola: { bankName: 'CreditoAgricola', fileFormat: 'XLSX', htmlExample: htmlExample },
    cryptoCom: { bankName: 'CryptoCom', fileFormat: 'CSV', htmlExample: htmlExample },
  };

  return configs[bankId];
}
