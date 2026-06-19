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
  descColumnPosition?: number;
  cdColumnPosition?: number;
}

export interface BudgetType {
  id: string;
  type: string;
}

export interface CategoryRule {
  id?: string;
  keyword?: string;
  category?: string;
  category_id?: string;
  subCategory?: string;
  subCategory_id?: string;
  type?: string;
  type_id?: string;
}

export interface CategoryRuleSavePayload {
  id?: string;
  keyword?: string;
  typeId?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export interface BankConfig {
  id: string;
  bankName: string;
  firstLine: number;
  dateColumnPos: number;
  amountColumnPos: number;
  descColumnPos: number;
  creditDebitColumnPos: number;
  dateFormat: string;
  delimiter: string;
  fileFormat: string;
  ignoreValues: string | null;
}

export interface TransactionPreview {
  bankName?: string;
  date: string;
  type?: string;
  category?: string | null;
  subCategory?: string | null;
  value: number;
  originalDescription: string;
}
