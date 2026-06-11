import { BankFormat } from '@/types';
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

  async convertCryptoComFile(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/file/cryptoCom', formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  async convertCreditoAgricolaFile(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/file/creditoAgricola', formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  async convertActivoBankFile(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/file/activoBank', formData, {
      responseType: 'blob',
    });

    return response.data;
  }

  async getBankFormat(bankId: string): Promise<BankFormat> {
    const response = await this.client.get(`/format/${bankId}`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }

  async convertAllBankFiles(activoBankFile?: File, creditoAgricolaFile?: File, cryptoComFile?: File): Promise<Blob> {
    const formData = new FormData();

    if (activoBankFile) {
      formData.append('activoBankFile', activoBankFile);
    }
    if (creditoAgricolaFile) {
      formData.append('creditoAgricolaFile', creditoAgricolaFile);
    }
    if (cryptoComFile) {
      formData.append('cryptoComFile', cryptoComFile);
    }

    const response = await this.client.post('/file/all', formData, {
      responseType: 'blob',
    });

    return response.data;
  }
}

export default new BudgetApiService();
