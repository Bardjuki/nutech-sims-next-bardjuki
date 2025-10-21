import { ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  UpdateProfileRequest, } from '../types/apiTypes';
import apiClient from './apiClient';

/**
 * Membership API Service
 */
export const memberApi = {
  /**
   * Login user
   * POST /login
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/login',
      credentials
    );
        
    return response.data;
  },

  /**
   * Register new user
   * POST /registration
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      '/registration',
      userData
    );
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/profile');
    return response.data;
  },

  /**
   * Update user profile
   * PUT /profile/update
   * Requires: Authorization header with Bearer token
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/profile/update',
      data
    );
    return response.data;
  },

  /**
   * Update profile image
   * PUT /profile/image
   * Requires: Authorization header with Bearer token
   * Content-Type: multipart/form-data
   */
  updateProfileImage: async (
    imageFile: File
  ): Promise<ApiResponse<UserProfile>> => {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/profile/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default memberApi;