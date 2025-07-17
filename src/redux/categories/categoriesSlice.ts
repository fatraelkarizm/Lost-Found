import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define the Category type based on your API response
export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

// Define the state for the categories slice
interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch categories from the API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  // Note: If your API requires authentication, you can pass the token as an argument token: string
  
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8889/api/category', {
        headers: {
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.errors || 'Failed to fetch categories');
      }

      const data = await response.json();
      return data.data as Category[];
    } catch (error) {
      return rejectWithValue('Network error or unexpected issue');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectCategoriesStatus = (state: RootState) => state.categories.status;
export const selectCategoriesError = (state: RootState) => state.categories.error;

export default categoriesSlice.reducer;