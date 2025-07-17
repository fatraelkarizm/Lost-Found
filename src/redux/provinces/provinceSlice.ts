import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface Province {
     id: string;
     name: string;
     slug: string;
     created_at: string | null | undefined;
     updated_at: string | null | undefined;
}

interface ProvincesState {
     provinces: Province[];
     status: "idle" | "loading" | "succeeded" | "failed";
     error: string | null;
}

const initialState: ProvincesState = {
     provinces: [],
     status: "idle",
     error: null,
};

export const fetchProvinces = createAsyncThunk(
     "provinces/fetchProvinces",
     // Note: If your API requires authentication, you can pass the token as an argument token: string
     async (_, { rejectWithValue }) => {
          try {
               const response = await fetch("http://localhost:8889/api/province", {
                    headers: {
                         // "Authorization": `Bearer ${token}`,
                    },
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    return rejectWithValue(errorData.errors || "Failed to fetch provinces");
               }

               const data = await response.json();
               return data.data as Province[];
          } catch (error) {
               return rejectWithValue("Network error or unexpected issue");
          }
     })

const provincesSlice = createSlice({
     name: "provinces",
     initialState,
     reducers: {},
     extraReducers: (builder) => {
          builder
               .addCase(fetchProvinces.pending, (state) => {
                    state.status = "loading";
               })
               .addCase(fetchProvinces.fulfilled, (state, action: PayloadAction<Province[]>) => {
                    state.status = "succeeded";
                    state.provinces = action.payload;
               })
               .addCase(fetchProvinces.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload as string;
               });
     }
});

export const selectProvinces = (state: { provinces: ProvincesState }) => state.provinces.provinces;
export const selectProvincesStatus = (state: { provinces: ProvincesState }) => state.provinces.status;
export const selectProvincesError = (state: { provinces: ProvincesState }) => state.provinces.error;

export default provincesSlice.reducer;