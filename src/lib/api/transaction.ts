import {    ApiResponse,
  Balance,
  Banner,
  Service,
  TransactionRequest,
  Transaction,
  TransactionHistoryParams,
  TransactionHistoryResponse,
  TopUpRequest,
  TopUpResponse, } from '../types/apiTypes';
import apiClient from './apiClient';
/**
 * Transaction API Service
 */
export const transactionApi = {
  /**
   * Get user balance
   * GET /balance
   * Requires: Authorization header with Bearer token
   */
  getBalance: async (): Promise<ApiResponse<Balance>> => {
    const response = await apiClient.get<ApiResponse<Balance>>('/balance');
    return response.data;
  },

  /**
   * Get list of banners
   * GET /banner
   * Requires: Authorization header with Bearer token
   */
  getBanners: async (): Promise<ApiResponse<Banner[]>> => {
    const response = await apiClient.get<ApiResponse<Banner[]>>('/banner');
    return response.data;
  },

  /**
   * Get list of services
   * GET /services
   * Requires: Authorization header with Bearer token
   */
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data;
  },

  /**
   * Create a transaction
   * POST /transaction
   * Requires: Authorization header with Bearer token
   */
  createTransaction: async (
    data: TransactionRequest
  ): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/transaction',
      data
    );
    return response.data;
  },

  /**
   * Get transaction history
   * GET /transaction/history
   * Requires: Authorization header with Bearer token
   */
  getTransactionHistory: async (
    params?: TransactionHistoryParams
  ): Promise<ApiResponse<TransactionHistoryResponse>> => {
    const response = await apiClient.get<ApiResponse<TransactionHistoryResponse>>(
      '/transaction/history',
      { params }
    );
    return response.data;
  },

  /**
   * Top up balance
   * POST /topup
   * Requires: Authorization header with Bearer token
   */
  topUp: async (data: TopUpRequest): Promise<ApiResponse<TopUpResponse>> => {
    const response = await apiClient.post<ApiResponse<TopUpResponse>>(
      '/topup',
      data
    );
    return response.data;
  },
};

export default transactionApi;