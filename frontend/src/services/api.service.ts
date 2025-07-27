import axios, { AxiosResponse } from 'axios';
import {
  CompareRequest,
  CompareResult,
  BatchCompareRequest,
  BatchCompareResult,
  UrlCompareRequest,
  ApiResponse,
} from '../types/xml-compare.types';

const API_BASE_URL = '/api/xml-compare';

class ApiService {
  private readonly api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Compares two XML strings
   * @param request - Comparison request
   * @returns Promise<CompareResult> - Comparison result
   */
  async compareXml(request: CompareRequest): Promise<CompareResult> {
    try {
      const response: AxiosResponse<ApiResponse<CompareResult>> = await this.api.post(
        '/compare',
        request,
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Comparison failed');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Compares multiple XML pairs in batch
   * @param request - Batch comparison request
   * @returns Promise<BatchCompareResult> - Batch comparison results
   */
  async compareBatch(request: BatchCompareRequest): Promise<BatchCompareResult> {
    try {
      const response: AxiosResponse<ApiResponse<BatchCompareResult>> = await this.api.post(
        '/batch-compare',
        request,
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Batch comparison failed');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Compares XML files from URLs
   * @param request - URL comparison request
   * @returns Promise<CompareResult> - Comparison result
   */
  async compareFromUrls(request: UrlCompareRequest): Promise<CompareResult> {
    try {
      const response: AxiosResponse<ApiResponse<CompareResult>> = await this.api.post(
        '/compare-urls',
        request,
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'URL comparison failed');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Health check endpoint
   * @returns Promise<{ status: string; timestamp: string }> - Health status
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.post('/admin/test');
      return response.data;
    } catch (error) {
      throw new Error('Health check failed');
    }
  }
}

export const apiService = new ApiService(); 