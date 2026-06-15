export interface FileConversionRequest {
  file?: File;
  activoBankFile?: File;
  creditoAgricolaFile?: File;
  cryptoComFile?: File;
}

export interface BankOption {
  id: string;
  name: string;
  endpoint: string;
  description: string;
  icon?: string;
  logo?: string;
}

export interface BankFormat {
  bankName: string;
  fileFormat: string;
  htmlExample: string;
  firstDataLine?: number;
  dateColumnPosition?: number;
  amountColumnPosition?: number;
  descriptionColumnPosition?: number;
  creditDebitColumnPosition?: number;
  dateFormat?: string;
  delimiter?: string;
}

export interface ConversionStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
  fileName?: string;
}

export interface BankConfigRequest {
  firstLine?: number;
  delimiter?: string;
  dateFormat?: string;
  amountColumnPosition?: number;
  dateColumnPosition?: number;
  descriptionColumnPosition?: number;
  cdColumnPosition?: number;
}
