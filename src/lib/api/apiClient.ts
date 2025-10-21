import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL
const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Variable to store token in memory
let authToken: string | null = null;

// Function to set token
export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

// Function to get token
export const getAuthToken = (): string | null => {
  return authToken;
};

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from memory
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - clear token
        authToken = null;
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      } else if (status === 403) {
        console.error('Forbidden: You do not have permission');
      } else if (status === 500) {
        console.error('Server error: Please try again later');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error: Please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;