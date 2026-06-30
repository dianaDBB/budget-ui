export interface FileConversionRequest {
  file?: File;
  activoBankFile?: File;
  creditoAgricolaFile?: File;
  cryptoComFile?: File;
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

export interface PreviewData {
  bankName?: string;
  date: string;
  type?: string;
  category?: string | null;
  subCategory?: string | null;
  value: number;
  originalDescription: string;
}

//****************************************************************************************************** CATEGORY RULES

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

export interface UpdateCategoryRulePayload {
  id?: string;
  keyword?: string;
  typeId?: string;
  categoryId?: string;
  subcategoryId?: string;
}

//********************************************************************************************************* FILE CONFIG

export interface FileConfig {
  bankName: string;
  fileFormat: string;
  firstDataLine: number;
  dateColumnPosition: number;
  amountColumnPosition: number;
  descriptionColumnPosition: number;
  creditDebitColumnPosition?: number;
  dateFormat: string;
  delimiter?: string;
  ignoreValues: string[];
  htmlExample: string;
}

export interface UpdateFileConfigPayload {
  bankName?: string;
  fileFormat?: string;
  firstLine?: number;
  dateColumnPosition?: number;
  amountColumnPosition?: number;
  descColumnPosition?: number;
  cdColumnPosition?: number;
  dateFormat?: string;
  delimiter?: string;
  ignoreValues?: string;
}

//************************************************************************************************************* CONFIGS

export interface Bank {
  name: string;
}

export interface Type {
  id: string;
  type: string;
}

export interface Category {
  id: string;
  category: string;
}

export interface Subcategory {
  id: string;
  subcategory: string;
}

export interface SubcategoriesByCategory {
  category: string;
  subcategories: Subcategory[];
}

//**************************************************************************************************************** APIS

export interface ApiResponseStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
  fileName?: string;
}
