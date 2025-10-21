import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import paymentReducer from '../features/payment/paymentSlice';
import transactionReducer from '../features/transaction/transactionSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      payment: paymentReducer,
      transaction: transactionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
