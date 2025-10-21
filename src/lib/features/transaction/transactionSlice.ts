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
} from '@/lib/types/apiTypes';

interface TransactionState {
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
>(
  'transaction/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getBalance();

      if (response.status === 0) {
        return response.data!;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch balance');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch balance'
      );
    }
  }
);

// Create transaction
export const createTransaction = createAsyncThunk<
  Transaction,
  TransactionRequest,
  { rejectValue: string }
>(
  'transaction/createTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await transactionApi.createTransaction(data);

      if (response.status === 0) {
        return response.data!;
      } else {
        return rejectWithValue(response.message || 'Transaction failed');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Transaction failed'
      );
    }
  }
);

// Fetch transaction history
export const fetchTransactionHistory = createAsyncThunk<
  TransactionHistoryResponse,
  TransactionHistoryParams | undefined,
  { rejectValue: string }
>(
  'transaction/fetchTransactionHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionHistory(params);

      if (response.status === 0) {
        return response.data!;
      } else {
        return rejectWithValue(
          response.message || 'Failed to fetch transaction history'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transaction history'
      );
    }
  }
);

// Top up balance
export const topUpBalance = createAsyncThunk<
  TopUpResponse,
  TopUpRequest,
  { rejectValue: string }
>(
  'transaction/topUpBalance',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.topUp(data);

      if (response.status === 0) {
        // Refresh balance after successful top up
        dispatch(fetchBalance());
        return response.data!;
      } else {
        return rejectWithValue(response.message || 'Top up failed');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Top up failed'
      );
    }
  }
);

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
    // Fetch Balance
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

    // Create Transaction
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
        // Add new transaction to the beginning of the list
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isCreatingTransaction = false;
        state.error = action.payload || 'Transaksi gagal';
        state.successMessage = null;
      });

    // Fetch Transaction History
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
        state.hasMore = records.length === limit;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.isLoadingTransactions = false;
        state.error = action.payload || 'Failed to fetch transaction history';
      });

    // Top Up Balance
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