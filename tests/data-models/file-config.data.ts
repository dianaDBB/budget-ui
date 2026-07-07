export interface FileConfig {
  id: string;
  bankName: string;
  fileFormat: string;
  firstLine: number;
  dateColumnPos: number;
  amountColumnPos: number;
  descColumnPos: number;
  creditDebitColumnPos: number;
  dateFormat: string;
  delimiter: string | null;
  ignoreValues: string | null;
}

export class FileConfigData {
  static activoBank(): FileConfig {
    return {
      id: '3485dad6-345c-4b52-a479-e0adf1c66b83',
      bankName: 'ActivoBank',
      fileFormat: 'XLSX',
      firstLine: 8,
      dateColumnPos: 1,
      amountColumnPos: 3,
      descColumnPos: 2,
      creditDebitColumnPos: -1,
      dateFormat: 'dd-MMM-yyyy',
      delimiter: null,
      ignoreValues: null,
    };
  }

  static creditoAgricola(): FileConfig {
    return {
      id: 'fc40768e-060c-4ec2-be12-d2b46d7129ac',
      bankName: 'CreditoAgricola',
      fileFormat: 'XLSX',
      firstLine: 6,
      dateColumnPos: 0,
      amountColumnPos: 4,
      descColumnPos: 2,
      creditDebitColumnPos: 5,
      dateFormat: 'dd/MM/yyyy',
      delimiter: '\t',
      ignoreValues: 'Nome Ordenante,NIB/IBAN/Conta Ordenante,Nome do Beneficiário,Referência',
    };
  }

  static cryptoCom(): FileConfig {
    return {
      id: '82a547e9-443e-46b9-9bea-80e1babb7644',
      bankName: 'CryptoCom',
      fileFormat: 'CSV',
      firstLine: 2,
      dateColumnPos: 0,
      amountColumnPos: 3,
      descColumnPos: 1,
      creditDebitColumnPos: -1,
      dateFormat: 'yyyy-MM-dd HH:mm:ss',
      delimiter: ',',
      ignoreValues: null,
    };
  }

  static all(): FileConfig[] {
    return [FileConfigData.activoBank(), FileConfigData.creditoAgricola(), FileConfigData.cryptoCom()];
  }
}
