import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionApi } from '@/lib/api/transaction';
import {
  Balance,
  Transaction,
  TransactionHistoryParams,
  TransactionHistoryResponse,
  TopUpRequest,
  TopUpResponse,
  TransactionRequest,
  ApiError,
  TransactionState,
} from '@/lib/types/apiTypes';

const initialState: TransactionState = {
  balance: null,
  transactions: [],
  currentTransaction: null,
  topUpResult: null,
  offset: 0,
  limit: 5,
  hasMore: true,
  isLoadingBalance: false,
  isLoadingTransactions: false,
  isCreatingTransaction: false,
  isTopingUp: false,
  error: null,
  successMessage: null,
};

// Fetch balance
export const fetchBalance = createAsyncThunk<
  Balance,
  void,
  { rejectValue: string }
>('transaction/fetchBalance', async (_, { rejectWithValue }) => {
  try {
    const response = await transactionApi.getBalance();

    if (response.status === 0) {
      return response.data!;
    } else {
      return rejectWithValue(response.message || 'Failed to fetch balance');
    }
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(
      apiError.response?.data?.message || 'Failed to fetch balance'
    );
  }
});

// Create transaction
export const createTransaction = createAsyncThunk<
  Transaction,
  TransactionRequest,
  { rejectValue: string }
>('transaction/createTransaction', async (data, { rejectWithValue }) => {
  try {
    const response = await transactionApi.createTransaction(data);

    if (response.status === 0) {
      return response.data!;
    } else {
      return rejectWithValue(response.message || 'Transaction failed');
    }
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(
      apiError.response?.data?.message || 'Transaction failed'
    );
  }
});

export const fetchTransactionHistory = createAsyncThunk<
  TransactionHistoryResponse,
  TransactionHistoryParams | undefined,
  { rejectValue: string }
>(
  'transaction/fetchTransactionHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionHistory(params);
      console.log(response, 'resonse');
      if (response.status === 0) {
        return response.data!;
      } else {
        return rejectWithValue(
          response.message || 'Failed to fetch transaction history'
        );
      }
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message ||
          'Failed to fetch transaction history'
      );
    }
  }
);

export const topUpBalance = createAsyncThunk<
  TopUpResponse,
  TopUpRequest,
  { rejectValue: string }
>('transaction/topUpBalance', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await transactionApi.topUp(data);

    if (response.status === 0) {
      dispatch(fetchBalance());
      return response.data!;
    } else {
      return rejectWithValue(response.message || 'Top up failed');
    }
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.response?.data?.message || 'Top up failed');
  }
});

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearTopUpResult: (state) => {
      state.topUpResult = null;
    },
    resetTransactions: (state) => {
      state.transactions = [];
      state.offset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoadingBalance = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoadingBalance = false;
        state.balance = action.payload;
        state.error = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoadingBalance = false;
        state.error = action.payload || 'Failed to fetch balance';
      });

    builder
      .addCase(createTransaction.pending, (state) => {
        state.isCreatingTransaction = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isCreatingTransaction = false;
        state.currentTransaction = action.payload;
        state.successMessage = 'Transaksi berhasil';
        state.error = null;

        const exists = state.transactions.some(
          (t) => t.invoice_number === action.payload.invoice_number
        );
        if (!exists) {
          state.transactions.unshift(action.payload);
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isCreatingTransaction = false;
        state.error = action.payload || 'Transaksi gagal';
        state.successMessage = null;
      });

    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.isLoadingTransactions = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.isLoadingTransactions = false;

        const { offset, limit, records } = action.payload;

        if (offset === 0) {
          state.transactions = records;
        } else {
          state.transactions = [...state.transactions, ...records];
        }

        state.offset = offset;
        state.limit = limit;
        state.hasMore = records.length === Number(limit);
        state.error = null;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.isLoadingTransactions = false;
        state.error = action.payload || 'Failed to fetch transaction history';
      });

    builder
      .addCase(topUpBalance.pending, (state) => {
        state.isTopingUp = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(topUpBalance.fulfilled, (state, action) => {
        state.isTopingUp = false;
        state.topUpResult = action.payload;
        state.successMessage = 'Top up berhasil';
        state.error = null;
      })
      .addCase(topUpBalance.rejected, (state, action) => {
        state.isTopingUp = false;
        state.error = action.payload || 'Top up gagal';
        state.successMessage = null;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  clearMessages,
  clearCurrentTransaction,
  clearTopUpResult,
  resetTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
