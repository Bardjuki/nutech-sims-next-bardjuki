import { setAuthToken } from '@/lib/api/apiClient';
import { memberApi } from './../../api/member';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    token?: string;
  } | null;
}

interface ProfileResponse {
  status: number;
  message: string;
  data: User;
}

interface ErrorResponse {
  status: number;
  message: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface CheckAuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isUpdatingProfile: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isUpdatingProfile: false,
  error: null,
  successMessage: null,
};

// Login async thunk
export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await memberApi.login(credentials);

      if (response.status === 0) {
        if (typeof window !== 'undefined' && response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        setAuthToken(response.data?.token);
        
        // Fetch user profile
        const profileResponse = await memberApi.getProfile();

        // Return both token and user
        return {
          token: response.data?.token || '',
          user: profileResponse.data,
        };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };

        return rejectWithValue(
          axiosError.response?.data?.message || 'Login failed. Please try again.'
        );
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

// Register async thunk
export const register = createAsyncThunk<
  ApiResponse,
  {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  },
  { rejectValue: ErrorResponse }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await memberApi.register({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password,
      });

      if (response.status === 0) {
        return response;
      } else {
        return rejectWithValue({
          status: response.status,
          message: response.message || 'Registration failed',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              status?: number;
              message?: string;
            };
          };
          message?: string;
        };

        if (axiosError.response?.data) {
          return rejectWithValue({
            status: axiosError.response.data.status || 500,
            message: axiosError.response.data.message || 'Registration failed. Please try again.',
          });
        }
        return rejectWithValue({
          status: 500,
          message: axiosError.message || 'Network error. Please check your connection.',
        });
      }
      return rejectWithValue({
        status: 500,
        message: 'An unexpected error occurred.',
      });
    }
  }
);

// Update profile async thunk
export const updateProfile = createAsyncThunk<
  User,
  { first_name: string; last_name: string },
  { rejectValue: string }
>(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await memberApi.updateProfile(data);

      if (response.status === 0) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update profile');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };

        return rejectWithValue(
          axiosError.response?.data?.message || 'Failed to update profile'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Update profile image async thunk
export const updateProfileImage = createAsyncThunk<
  User,
  File,
  { rejectValue: string }
>(
  'auth/updateProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await memberApi.updateProfileImage(imageFile);

      if (response.status === 0) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update profile image');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };

        return rejectWithValue(
          axiosError.response?.data?.message || 'Failed to update profile image'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Logout async thunk
export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  setAuthToken(null); // Clear the auth token
  return null;
});

// Check auth async thunk
export const checkAuth = createAsyncThunk<
  CheckAuthResponse,
  void,
  { rejectValue: string }
>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window === 'undefined') {
        return rejectWithValue('No window object');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      setAuthToken(token); // Set token before making request
      const response = await memberApi.getProfile();

      if (response.status === 0) {
        return { user: response.data, token };
      } else {
        localStorage.removeItem('token');
        setAuthToken(null);
        return rejectWithValue('Invalid token');
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setAuthToken(null);
      return rejectWithValue('Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
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
    logout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setAuthToken(null);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message || 'Registrasi berhasil silahkan login';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.successMessage = null;
        
        if (action.payload) {
          const { status, message } = action.payload;
          
          switch (status) {
            case 102:
              state.error = message || 'Format email tidak sesuai';
              break;
            case 103:
              state.error = message || 'Email sudah terdaftar';
              break;
            case 104:
              state.error = message || 'Password tidak memenuhi kriteria';
              break;
            default:
              state.error = message || 'Registrasi gagal. Silakan coba lagi.';
          }
        } else {
          state.error = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
        state.successMessage = 'Profile berhasil diperbarui';
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload || 'Gagal memperbarui profile';
        state.successMessage = null;
      });

    // Update Profile Image
    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
        state.successMessage = 'Foto profile berhasil diperbarui';
        state.error = null;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload || 'Gagal memperbarui foto profile';
        state.successMessage = null;
      });

    // Logout
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    });

    // Check Auth
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearSuccessMessage, clearMessages, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;