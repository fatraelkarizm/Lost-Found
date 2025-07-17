// @/redux/item/itemSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store';

// Interface for User data within Item
interface ItemUser {
     id: string;
     email: string;
     name: string;
     username: string | null;
     photoprofile: string | null;

}

// Interface for Category data within Item
interface ItemCategory {
     slug: string;
     name: string;
}

// Interface for City data within Item
interface ItemCity {
     slug: string;
     name: string;
}

// Interface for Province data within Item
interface ItemProvince {
     slug: string;
     name: string;
}

// Interface for Image data within Item
interface ItemImage {
     id: string;
     url: string;
}

// Interface for Item itself
export interface Item {
     [x: string]: any;
     id: string;
     name: string;
     description: string;
     category: ItemCategory;
     address: string;
     city: ItemCity;
     province: ItemProvince;
     images: ItemImage[];
     user: ItemUser;
     isFound: boolean; // boolean
     foundAt: string | null;
     isActive: boolean;
     createdAt: string;
     editedAt?: string | null;
     countComment: number;
}

// Interface untuk payload filter pencarian
interface FetchItemsFilters {
  q?: string;
  category?: string; 
  city?: string; 
  province?: string; 
     timeFilter?: string;
     isUrgent?: boolean;
     isRecentlyAdded?: boolean;
}

interface FetchItemsPayload {
     limit?: number;
     cursor?: string;
     filters?: FetchItemsFilters;
     replace?: boolean;
}

interface ItemsState {
     items: Item[];
     status: 'idle' | 'loading' | 'succeeded' | 'failed';
     error: string | null;
     nextCursor: string | null;
     hasMore: boolean;
}

const initialState: ItemsState = {
     items: [],
     status: 'idle',
     error: null,
     nextCursor: null,
     hasMore: true,
};

export const fetchItems = createAsyncThunk(
     'items/fetchItems',
     // Ubah payload agar menerima objek filter
     async (payload: FetchItemsPayload, { rejectWithValue }) => {
          const { limit = 6, cursor, filters } = payload; // Default limit 6
          try {
               const params = {
                    limit,
                    cursor,
                    ...(filters?.q && { q: filters.q }), // 'q'
        ...(filters?.category && { category: filters.category }), // 'category'
        ...(filters?.city && { city: filters.city }), // 'city'
        ...(filters?.province && { province: filters.province }), // 'province'
                    // ...(filters?.query && { q: filters.query }),
                    // ...(filters?.categoryIds && filters.categoryIds.length > 0 && { categories: filters.categoryIds.join(',') }),
                    // ...(filters?.provinceId && { province_id: filters.provinceId }),
                    // ...(filters?.cityId && { city_id: filters.cityId }),
                    // ...(filters?.timeFilter && { time_filter: filters.timeFilter }),
                    // ...(filters?.isUrgent && { urgent: true }),
                    // ...(filters?.isRecentlyAdded && { recently_added: true }),
               };

               const response = await axios.get('http://localhost:8889/api/item/search', { //
                    params: params,
                    // Hapus header Authorization jika tidak diperlukan untuk public access
               });
               // Respons API: { data: Item[], nextCursor: string | null }
               return response.data as { data: Item[]; nextCursor: string | null };
          } catch (error: any) {
               if (axios.isAxiosError(error)) {
                    return rejectWithValue(error.response?.data?.errors || 'Failed to fetch items');
               }
               return rejectWithValue('An unexpected error occurred');
          }
     }
);

const itemsSlice = createSlice({
     name: 'items',
     initialState,
     reducers: {
          clearItems: (state) => {
               state.items = [];
               state.status = 'idle';
               state.error = null;
               state.nextCursor = null;
               state.hasMore = true;
          },
     },
     extraReducers: (builder) => {
          builder
               .addCase(fetchItems.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
               })
               .addCase(fetchItems.fulfilled, (state, action: PayloadAction<{ data: Item[]; nextCursor: string | null }, string, { arg: FetchItemsPayload }>) => { // Perlu PayloadAction arg
                    state.status = 'succeeded';
                    if (action.meta.arg.replace) { 
                         state.items = action.payload.data;
                    } else { 
                         state.items.push(...action.payload.data);
                    }
                    state.nextCursor = action.payload.nextCursor;
                    state.hasMore = !!action.payload.nextCursor;
               })
               .addCase(fetchItems.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = (action.payload as string) || action.error.message || 'Failed to fetch items';
                    state.hasMore = false;
               });
     },
});

export const { clearItems } = itemsSlice.actions;

export const selectItems = (state: RootState) => state.items.items;
export const selectItemsStatus = (state: RootState) => state.items.status;
export const selectItemsError = (state: RootState) => state.items.error;
export const selectNextCursor = (state: RootState) => state.items.nextCursor;
export const selectHasMoreItems = (state: RootState) => state.items.hasMore;

export default itemsSlice.reducer;