import {
  FileConfig,
  BankConfig,
  CategoryRule,
  UpdateCategoryRulePayload,
  PreviewData,
  UpdateFileConfigPayload,
  Type,
  Category,
  Subcategory,
  SubcategoriesByCategory,
} from '@/types';
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

  //*************************************************************************************************** DROPDOWN VALUES

  async getAllTypes(): Promise<Type[]> {
    const response = await this.client.get('/type/all', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getAllCategories(): Promise<Category[]> {
    const response = await this.client.get('/category/all', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getSubcategoriesByCategory(categoryName: string): Promise<Subcategory[]> {
    const response = await this.client.get(`/subcategory/${encodeURIComponent(categoryName)}/all`, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  //******************************************************************************************** PREVIEW MULTIPLE FILES

  async previewMultipleFiles(files: { bankName: string; file: File }[]): Promise<PreviewData[]> {
    const formData = new FormData();
    const params = new URLSearchParams();

    for (const { bankName, file } of files) {
      formData.append('files', file);
      params.append('bankNames', bankName);
    }

    const response = await this.client.post(`/file/preview-all?${params.toString()}`, formData, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async previewToExcel(transactions: PreviewData[]): Promise<Blob> {
    const response = await this.client.post('/file/preview-to-excel', transactions, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/octet-stream' },
      responseType: 'blob',
    });

    return response.data;
  }

  //******************************************************************************************** CONVERT MULTIPLE FILES

  async convertMultipleFiles(files: { bankName: string; file: File }[]): Promise<Blob> {
    const formData = new FormData();
    const params = new URLSearchParams();

    for (const { bankName, file } of files) {
      formData.append('files', file);
      params.append('bankNames', bankName);
    }

    const response = await this.client.post(`/file/all?${params.toString()}`, formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  //**************************************************************************************************** CATEGORY RULES

  async getCategoryRules(): Promise<CategoryRule[]> {
    const response = await this.client.get('/category-rule/all', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async updateCategoryRules(rules: UpdateCategoryRulePayload[]): Promise<void> {
    await this.client.put('/category-rule/', rules, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteCategoryRules(rules: string[]): Promise<void> {
    await this.client.delete('/category-rule/', {
      data: rules,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  //******************************************************************************************************* FILE CONFIG

  async getFileConfig(bankName: string): Promise<FileConfig> {
    const response = await this.client.get(`/file-config/${bankName}`, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getAllFilesConfigs(): Promise<BankConfig[]> {
    const response = await this.client.get('/file-config/all', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async updateFileConfig(bankName: string, config: UpdateFileConfigPayload): Promise<void> {
    await this.client.put(`/file-config/${bankName}`, config, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async addFileConfig(config: UpdateFileConfigPayload): Promise<void> {
    await this.client.post(`/file-config/`, config, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteFileConfig(bankName: string): Promise<void> {
    await this.client.delete(`/file-config/${bankName}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  //************************************************************************************************************* CACHE

  async refreshCache(): Promise<void> {
    await this.client.post('/cache/refresh', null, {
      headers: { Accept: 'application/json' },
    });
  }
}

export default new BudgetApiService();
