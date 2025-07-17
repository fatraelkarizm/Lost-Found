// @/redux/image/imageSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store';

export interface Image {
  id: string;
  url: string;
}

interface ImageState {
  images: Image[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  status: 'idle',
  error: null,
};


export const uploadImages = createAsyncThunk(
  'image/uploadImages',
  async ({ idItem, files }: { idItem: string; files: File[] }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const authToken = state.auth.token; 

    if (!authToken) {
      return rejectWithValue('No authentication token found.');
    }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images[]', file); 
      });

      const response = await axios.post(`http://localhost:8889/api/item/${idItem}/images`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
      // API mengembalikan array of image objects
      return response.data.data as Image[];
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to upload images');
      }
      return rejectWithValue('An unexpected error occurred during image upload');
    }
  }
);

export const deleteImages = createAsyncThunk(
  'image/deleteImages',
  async ({ idItem, imageIds }: { idItem: string; imageIds: string[] }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const authToken = state.auth.token; 

    if (!authToken) {
      return rejectWithValue('No authentication token found.');
    }

    try {
      const response = await axios.delete(`http://localhost:8889/api/item/${idItem}/images`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { imageIds }, 
      });
      return { success: response.data.data as boolean, deletedImageIds: imageIds };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to delete images');
      }
      return rejectWithValue('An unexpected error occurred during image deletion');
    }
  }
);

const imageSlice = createSlice({
  name: 'image', 
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearImages: (state) => {
      state.images = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle uploadImages
      .addCase(uploadImages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action: PayloadAction<Image[]>) => {
        state.status = 'succeeded';
        state.images.push(...action.payload); 
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Image upload failed';
      })
      // Handle deleteImages
      .addCase(deleteImages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteImages.fulfilled, (state, action: PayloadAction<{ success: boolean; deletedImageIds: string[] }>) => {
        state.status = 'succeeded';
        if (action.payload.success) {
          state.images = state.images.filter(img => !action.payload.deletedImageIds.includes(img.id));
        } else {
          state.error = 'Failed to delete some images.'; // Jika API mengembalikan false
        }
      })
      .addCase(deleteImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Image deletion failed';
      });
  },
});

export const { setImages, clearImages } = imageSlice.actions;

export const selectImages = (state: RootState) => state.image.images;
export const selectImageStatus = (state: RootState) => state.image.status;
export const selectImageError = (state: RootState) => state.image.error;

export default imageSlice.reducer;