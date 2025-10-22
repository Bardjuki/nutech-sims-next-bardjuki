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

export const transactionApi = {
 
  getBalance: async (): Promise<ApiResponse<Balance>> => {
    const response = await apiClient.get<ApiResponse<Balance>>('/balance');
    return response.data;
  },


  getBanners: async (): Promise<ApiResponse<Banner[]>> => {
    const response = await apiClient.get<ApiResponse<Banner[]>>('/banner');
    return response.data;
  },


  getServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data;
  },


  createTransaction: async (
    data: TransactionRequest
  ): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/transaction',
      data
    );
    return response.data;
  },


  getTransactionHistory: async (
    params?: TransactionHistoryParams
  ): Promise<ApiResponse<TransactionHistoryResponse>> => {
    const response = await apiClient.get<ApiResponse<TransactionHistoryResponse>>(
      '/transaction/history',
      { params }
    );
    return response.data;
  },

  topUp: async (data: TopUpRequest): Promise<ApiResponse<TopUpResponse>> => {
    const response = await apiClient.post<ApiResponse<TopUpResponse>>(
      '/topup',
      data
    );
    return response.data;
  },
};

export default transactionApi;