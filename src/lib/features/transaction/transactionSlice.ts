import { RootState } from '@/lib/config/reduxStore'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Transaction {
  id: string
  type: 'debit' | 'credit'
  amount: number
  currency: string
  description: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
  recipient?: string
  sender?: string
}

interface TransactionState {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  isLoading: boolean
  error: string | null
  filters: {
    type?: 'debit' | 'credit'
    status?: string
    dateFrom?: string
    dateTo?: string
  }
}

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
  filters: {},
}

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token
      
      const response = await fetch('/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch transactions')
      }
      
      return await response.json()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return rejectWithValue(`Failed to fetch transactions: ${errorMessage}`)
    }
  }
)

export const fetchTransactionById = createAsyncThunk(
  'transaction/fetchById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token
      
      const response = await fetch(`/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        return rejectWithValue('Transaction not found')
      }
      
      return await response.json()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return rejectWithValue(`Failed to fetch transaction: ${errorMessage}`)
    }
  }
)

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredTransactions = state.transactions.filter((transaction) => {
        const { type, status, dateFrom, dateTo } = state.filters
        
        if (type && transaction.type !== type) return false
        if (status && transaction.status !== status) return false
        if (dateFrom && new Date(transaction.createdAt) < new Date(dateFrom)) return false
        if (dateTo && new Date(transaction.createdAt) > new Date(dateTo)) return false
        
        return true
      })
    },
    clearFilters: (state) => {
      state.filters = {}
      state.filteredTransactions = state.transactions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
        state.filteredTransactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
    
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTransactionById.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilters, clearFilters } = transactionSlice.actions
export default transactionSlice.reducer