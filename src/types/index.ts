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

export interface ConversionStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
  fileName?: string;
}
