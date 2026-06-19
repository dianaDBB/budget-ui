import { BankFormat, BankConfig, BankConfigRequest, CategoryRule, TransactionPreview } from '@/types';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class BudgetApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: false,
      headers: {
        Accept: 'application/octet-stream',
      },
    });

    // Add request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for debugging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error - API might not be reachable at', API_BASE_URL);
        }
        return Promise.reject(error);
      },
    );
  }

  async convertBankFile(bankName: string, file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(`/budget/file/${bankName}`, formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  async getBankFormat(bankName: string): Promise<BankFormat> {
    const response = await this.client.get(`/file-config/${bankName}`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }

  async getAllBankConfigs(): Promise<BankConfig[]> {
    const response = await this.client.get('/file-config/all', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }

  async convertAllBankFiles(files: { bankName: string; file: File }[]): Promise<Blob> {
    const formData = new FormData();
    const params = new URLSearchParams();

    for (const { bankName, file } of files) {
      formData.append('files', file);
      params.append('bankNames', bankName);
    }

    const response = await this.client.post(`/budget/file/all?${params.toString()}`, formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  async updateBankConfig(bankName: string, config: BankConfigRequest): Promise<void> {
    await this.client.put(`/file-config/${bankName}`, config, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async getCategoryRules(): Promise<CategoryRule[]> {
    const response = await this.client.get('/category-rule/', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }

  async getSubcategoriesByCategory(categoryName: string): Promise<string[]> {
    const response = await this.client.get(`/subcategory/${encodeURIComponent(categoryName)}/all`, {
      headers: { Accept: 'application/json' },
    });
    return (response.data as { subcategory: string }[]).map((item) => item.subcategory).sort();
  }

  async updateCategoryRules(rules: CategoryRule[]): Promise<void> {
    await this.client.put('/category-rule/', rules, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async previewAllBankFiles(files: { bankName: string; file: File }[]): Promise<TransactionPreview[]> {
    const formData = new FormData();
    const params = new URLSearchParams();

    for (const { bankName, file } of files) {
      formData.append('files', file);
      params.append('bankNames', bankName);
    }

    const response = await this.client.post(`/budget/file/preview-all?${params.toString()}`, formData, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async generateExcelFromPreview(transactions: TransactionPreview[]): Promise<Blob> {
    const response = await this.client.post('/budget/file/preview-all/excel', transactions, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/octet-stream' },
      responseType: 'blob',
    });

    return response.data;
  }
}

export default new BudgetApiService();
