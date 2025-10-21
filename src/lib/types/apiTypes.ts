// API Response wrapper
export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token?: string;
  message?: string;
}

// User Profile types
export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
}

export interface UpdateProfileImageRequest {
  file: File;
}

// Balance & Transaction types
export interface Balance {
  balance: number;
}

export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

export interface TransactionRequest {
  service_code: string;
}

export interface ApiError {
  response?: {
    data?: ApiResponse;
    status?: number;
    statusText?: string;
  };
  message?: string;
}

export interface Transaction {
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
description: string,
  total_amount: number;
  created_on: string;
}

export interface TransactionHistoryParams {
  offset?: number;
  limit?: number;
}

export interface TransactionHistoryResponse {
  offset: number;
  limit: number;
  records: Transaction[];
}

// Top Up types
export interface TopUpRequest {
  top_up_amount: number;
}

export interface TopUpResponse {
  balance: number;
}

export interface TransactionState {
  balance: Balance | null;
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  topUpResult: TopUpResponse | null;
  offset: number;
  limit: number;
  hasMore: boolean;
  isLoadingBalance: boolean;
  isLoadingTransactions: boolean;
  isCreatingTransaction: boolean;
  isTopingUp: boolean;
  error: string | null;
  successMessage: string | null;
}