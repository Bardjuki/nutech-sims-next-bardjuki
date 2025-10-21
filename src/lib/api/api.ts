export { default as apiClient, setAuthToken, getAuthToken } from './apiClient';
// Export all types
export * from '../types/apiTypes';

import memberApi from './member';
import { transactionApi } from './transaction';

export const api = {
  membership: memberApi,
  transaction: transactionApi,
};

export default api;