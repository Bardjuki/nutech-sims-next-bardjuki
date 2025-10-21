import {    ApiResponse,
  Banner,
  Service,
   } from '../types/apiTypes';
import apiClient from './apiClient';
export const moduleApi = {
  getBanners: async (): Promise<ApiResponse<Banner[]>> => {
    const response = await apiClient.get<ApiResponse<Banner[]>>('/banner');
    return response.data;
  },
  
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data;
  },

};

export default moduleApi;