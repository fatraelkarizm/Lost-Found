// src/redux/userProfile/userProfileSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store';

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    username: string | null;
    photoprofile: string | null;
    isAdmin: boolean;
    city?: string | null;
    province?: string | null;
}

interface UserProfileState {
    profile: UserProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserProfileState = {
    profile: null,
    status: 'idle',
    error: null,
};

// Async thunk untuk mengambil data profil user
export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetchUserProfile',
    async (userId: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const authToken = state.auth.token; 

        if (!authToken) {
            return rejectWithValue('No authentication token found.');
        }

        try {
            const response = await axios.get(`http://localhost:8889/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data as UserProfile; // Asumsi API mengembalikan UserProfile
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to fetch user profile');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

// Async thunk untuk memperbarui data profil user
export const updateUserProfile = createAsyncThunk(
    'userProfile/updateUserProfile',
    async (updateData: Partial<UserProfile> & { userId: string }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const authToken = state.auth.token;
        const { userId, ...dataToUpdate } = updateData;

        if (!authToken) {
            return rejectWithValue('No authentication token found.');
        }

        try {
            const response = await axios.patch(`http://localhost:8889/api/user/${userId}`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data as UserProfile;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to update user profile');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);


const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        clearUserProfile: (state) => {
            state.profile = null;
            state.status = 'idle';
            state.error = null;
        },
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
            state.status = 'succeeded';
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching user profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to load user profile';
                state.profile = null;
            })
            // Handle updating user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.status = 'succeeded';
                state.profile = action.payload; // Perbarui profil dengan data terbaru
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to update user profile';
            });
    },
});

export const { clearUserProfile, setProfile } = userProfileSlice.actions;

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserProfileStatus = (state: RootState) => state.user.status;
export const selectUserProfileError = (state: RootState) => state.user.error;

export default userProfileSlice.reducer;