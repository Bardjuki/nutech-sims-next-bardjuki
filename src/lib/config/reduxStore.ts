import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import moduleReducer from '../features/module/moduleSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      transaction: transactionReducer,
      module: moduleReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
