import { RootState } from '@/lib/config/reduxStore'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface PaymentSession {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  description: string
  createdAt: string
  recipient?: string
}

interface PaymentState {
  currentSession: PaymentSession | null
  sessions: PaymentSession[]
  isLoading: boolean
  error: string | null
}

const initialState: PaymentState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
}

export const createPaymentSession = createAsyncThunk(
  'payment/createSession',
  async (paymentData: { amount: number; currency: string; description: string; recipient?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }
      
      return await response.json()
    } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return rejectWithValue(`Failed to create payment session: ${errorMessage}`)
    }
  }
)

export const processPayment = createAsyncThunk(
  'payment/process',
  async (sessionId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token
      
      const response = await fetch(`/api/payments/${sessionId}/process`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }
      
      return await response.json()
    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Unknown error'
           return rejectWithValue(`Payment processing failed: ${errorMessage}`)
    }
  }
)

export const fetchPaymentSessions = createAsyncThunk(
  'payment/fetchSessions',
  async (_, { getState, rejectWithValue }) => {
    try {
     const state = getState() as RootState
      const token = state.auth.token
      
      const response = await fetch('/api/payments/sessions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch sessions')
      }
      
      return await response.json()
    } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
           return rejectWithValue(`Failed to fetch payment sessions: ${errorMessage}`)
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearCurrentSession: (state) => {
      state.currentSession = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Create payment session
    builder
      .addCase(createPaymentSession.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPaymentSession.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSession = action.payload
      })
      .addCase(createPaymentSession.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
    
    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSession = action.payload
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
    
    // Fetch sessions
    builder
      .addCase(fetchPaymentSessions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPaymentSessions.fulfilled, (state, action) => {
        state.isLoading = false
        state.sessions = action.payload
      })
      .addCase(fetchPaymentSessions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSession, clearError } = paymentSlice.actions
export default paymentSlice.reducer