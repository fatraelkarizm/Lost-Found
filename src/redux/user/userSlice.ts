// src/redux/user/userSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store'; // Memastikan path store Anda

// Interface untuk data profil user
export interface UserProfile { // Interface ini tetap UserProfile
    id: string;
    email: string;
    name: string | null;
    username: string | null;
    photoprofile: string | null;
    isAdmin: boolean;
    city?: string | null;
    province?: string | null;
}

interface UserState { // Interface state slice diganti menjadi UserState
    profile: UserProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status untuk operasi profil
    error: string | null; // Error untuk operasi profil
}

const initialState: UserState = {
    profile: null,
    status: 'idle',
    error: null,
};

// ===============================================
// Async Thunk: Mengambil Data Profil User
// Ini akan dipanggil setelah user terautentikasi (menggunakan token dari authSlice)
// ===============================================
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile', // Nama thunk: user/fetchUserProfile
    async (userId: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const authToken = state.auth.token; // Mengambil token dari authSlice

        if (!authToken) {
            return rejectWithValue('No authentication token found.');
        }

        try {
            const response = await axios.get(`http://localhost:8889/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data as UserProfile;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to fetch user profile');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

// ===============================================
// Async Thunk: Memperbarui Data Profil User
// ===============================================
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile', // Nama thunk: user/updateUserProfile
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


const userSlice = createSlice({
    name: 'user', // <<< Nama slice adalah 'user' >>>
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile | null>) => {
            state.profile = action.payload;
            state.status = 'succeeded'; // Anggap berhasil jika profil diset
        },
        clearUserProfile: (state) => { // Nama reducer tetap clearUserProfile
            state.profile = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchUserProfile
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

            // Handle updateUserProfile
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to update user profile';
            });
    },
});

export const { setProfile, clearUserProfile } = userSlice.actions; // Action creators dari userSlice

// Selector untuk data profil user
export const selectUserProfile = (state: RootState) => state.user.profile; // <<< Mengakses state.user.profile >>>
export const selectUserProfileStatus = (state: RootState) => state.user.status; // <<< Mengakses state.user.status >>>
export const selectUserProfileError = (state: RootState) => state.user.error; // <<< Mengakses state.user.error >>>

// Selector untuk "current user" yang merupakan data profil user
export const selectCurrentUser = (state: RootState) => state.user.profile;

export default userSlice.reducer;