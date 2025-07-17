// @/redux/cities/citiesSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store';

export interface City {
  id: string;
  name: string;
  provinceId: string; //
}

interface CitiesState {
  cities: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CitiesState = {
  cities: [],
  status: 'idle',
  error: null,
};

export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async (payload: { authToken: string; idProvinceOrSlug?: string }, { rejectWithValue }) => {
    const { idProvinceOrSlug } = payload;
    if (!idProvinceOrSlug) {
        return rejectWithValue('Province ID is required to fetch cities.');
    }
    try {
      const response = await axios.get(`http://localhost:8889/api/province/${idProvinceOrSlug}`, { //
     //    headers: { Authorization: `Bearer ${authToken}` }, //
      });
      return response.data.data.cities as City[];
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to fetch cities');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    clearCities: (state) => { // Reducer untuk membersihkan kota
      state.cities = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCities.fulfilled, (state, action: PayloadAction<City[]>) => {
        state.status = 'succeeded';
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch cities';
        state.cities = []; // Clear cities on error
      });
  },
});

export const { clearCities } = citiesSlice.actions; 

export const selectCities = (state: RootState) => state.city.cities;
export const selectCitiesStatus = (state: RootState) => state.city.status;
export const selectCitiesError = (state: RootState) => state.city.error;

export default citiesSlice.reducer;