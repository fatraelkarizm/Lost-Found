// userSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the User interface based on your API documentation
export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  photoprofile: string | null;
  isAdmin: boolean;
  token: string;
  city?: string | null;
  province?: string | null;
}

// Define the initial state for the user slice
interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for Google login/signup
// This will call your /api/login endpoint
export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (id_token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8889/api/login', { id_token }); //
      // Assuming your API returns the user object and token directly under 'data'
      return response.data.data as User; //
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to login with Google'); //
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // You might want a logout action
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      // Clear token from localStorage as well
      localStorage.removeItem('userToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        // Store the token in localStorage
        localStorage.setItem('userToken', action.payload.token); //
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;