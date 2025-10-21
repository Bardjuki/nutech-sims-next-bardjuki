import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { moduleApi } from '@/lib/api/module'; // Adjust import path as needed
import { Banner, Service } from '@/lib/types/apiTypes';

interface ModuleState {
  banners: Banner[];
  services: Service[];
  isLoadingBanners: boolean;
  isLoadingServices: boolean;
  error: string | null;
}

const initialState: ModuleState = {
  banners: [],
  services: [],
  isLoadingBanners: false,
  isLoadingServices: false,
  error: null,
};

// Fetch banners async thunk
export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>(
  'module/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moduleApi.getBanners();

      if (response.status === 0) {
        return response.data || [];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch banners');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              status?: number;
            };
          };
          message?: string;
        };

        // Handle token expiration or invalid token
        if (axiosError.response?.data?.status === 108) {
          return rejectWithValue('Token tidak valid atau kadaluwarsa');
        }

        return rejectWithValue(
          axiosError.response?.data?.message || 'Failed to fetch banners'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Fetch services async thunk
export const fetchServices = createAsyncThunk<
  Service[],
  void,
  { rejectValue: string }
>(
  'module/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moduleApi.getServices();

      if (response.status === 0) {
        return response.data || [];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch services');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              status?: number;
            };
          };
          message?: string;
        };

        // Handle token expiration or invalid token
        if (axiosError.response?.data?.status === 108) {
          return rejectWithValue('Token tidak valid atau kadaluwarsa');
        }

        return rejectWithValue(
          axiosError.response?.data?.message || 'Failed to fetch services'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Fetch both banners and services together
export const fetchModuleData = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'module/fetchModuleData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all([
        dispatch(fetchBanners()),
        dispatch(fetchServices())
      ]);
    } catch (error) {
      return rejectWithValue('Failed to fetch module data');
    }
  }
);

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearModuleData: (state) => {
      state.banners = [];
      state.services = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Banners
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.isLoadingBanners = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.isLoadingBanners = false;
        state.banners = action.payload;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.isLoadingBanners = false;
        state.error = action.payload || 'Failed to fetch banners';
      });

    // Fetch Services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoadingServices = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoadingServices = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoadingServices = false;
        state.error = action.payload || 'Failed to fetch services';
      });

    // Fetch Module Data (both)
    builder
      .addCase(fetchModuleData.pending, (state) => {
        state.isLoadingBanners = true;
        state.isLoadingServices = true;
        state.error = null;
      })
      .addCase(fetchModuleData.fulfilled, (state) => {
        state.isLoadingBanners = false;
        state.isLoadingServices = false;
      })
      .addCase(fetchModuleData.rejected, (state, action) => {
        state.isLoadingBanners = false;
        state.isLoadingServices = false;
        state.error = action.payload || 'Failed to fetch module data';
      });
  },
});

export const { clearError, clearModuleData } = moduleSlice.actions;
export default moduleSlice.reducer;