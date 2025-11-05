import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  name: '',
  phone: '',
};

const developerReducer = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    clearForm: (state) => {
      state.email = '';
      state.name = '';
      state.phone = '';
    },
  },
});

export const { setEmail, setName, setPhone, clearForm } = developerReducer.actions;
export default developerReducer.reducer;
