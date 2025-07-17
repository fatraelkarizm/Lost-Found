// src/redux/user/userSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store'; // Asumsi path store Anda

// Interface untuk data user lengkap (profile)
export interface User {
    id: string;
    email: string;
    name: string | null;
    username: string | null;
    photoprofile: string | null;
    isAdmin: boolean;
    city?: string | null;
    province?: string | null;
}

// Interface untuk state slice user
interface UserState {
    token: string | null; // Token autentikasi
    isAuthenticated: boolean; // Status login
    profile: User | null; // Data profil user
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status operasi (login, fetch profile, update profile)
    error: string | null; // Pesan error
}

const initialState: UserState = {
    token: null, // <<< Di sini token kembali menjadi null sesuai permintaan Anda
    isAuthenticated: false, // Maka ini juga akan false secara default
    profile: null,
    status: 'idle',
    error: null,
};

// ===============================================
// Async Thunk untuk Login/Sign Up (misal dengan Google)
// ===============================================
interface LoginResponseData {
    id: string;
    email: string;
    name: string;
    username: string | null;
    photoprofile: string | null;
    isAdmin: boolean;
    token: string; // Token yang didapat dari backend
    city?: string | null;
    province?: string | null;
}

export const loginUser = createAsyncThunk(
    'user/login',
    async (id_token: string, { rejectWithValue }) => { // Hapus `dispatch` dari sini jika tidak langsung dispatch `setAuthToken`
        try {
            const response = await axios.post('http://localhost:8889/api/login', { id_token });
            const data = response.data.data as LoginResponseData;

            localStorage.setItem('authToken', data.token); // Simpan token ke localStorage saat login berhasil

            return data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to login');
            }
            return rejectWithValue('An unexpected error occurred during login');
        }
    }
);

// ===============================================
// Async Thunk untuk Mengambil Data Profil User
// ===============================================
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (userId: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const currentToken = state.user.token; // Mengambil token dari state user slice ini

        if (!currentToken) {
            return rejectWithValue('No authentication token found.');
        }

        try {
            const response = await axios.get(`http://localhost:8889/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
            return response.data.data as User;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to fetch user profile');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

// ===============================================
// Async Thunk untuk Memperbarui Data Profil User
// ===============================================
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (updateData: Partial<User> & { userId: string }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const currentToken = state.user.token; // Mengambil token dari state user slice ini
        const { userId, ...dataToUpdate } = updateData;

        if (!currentToken) {
            return rejectWithValue('No authentication token found.');
        }

        try {
            const response = await axios.patch(`http://localhost:8889/api/user/${userId}`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
            return response.data.data as User;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to update user profile');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);


const userSlice = createSlice({
    name: 'user', // Nama slice adalah 'user'
    initialState,
    reducers: {
        setAuthToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
            if (action.payload) {
                localStorage.setItem('authToken', action.payload);
            } else {
                localStorage.removeItem('authToken');
            }
        },
        setProfile: (state, action: PayloadAction<User | null>) => {
            state.profile = action.payload;
            state.status = 'succeeded';
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.profile = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('authToken'); // Hapus token dari localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle loginUser
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponseData>) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.isAuthenticated = true;
                const { token, ...profileData } = action.payload; // Pisahkan token dari data profil
                state.profile = profileData;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Login failed';
                state.token = null;
                state.isAuthenticated = false;
                state.profile = null;
                localStorage.removeItem('authToken');
            })

            // Handle fetchUserProfile
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.isAuthenticated = true; // Jika berhasil fetch profile, anggap terautentikasi
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to load user profile';
                state.profile = null;
                state.isAuthenticated = false; // Jika fetch profile gagal, anggap tidak autentikasi
                state.token = null;
                localStorage.removeItem('authToken');
            })

            // Handle updateUserProfile
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to update user profile';
            });
    },
});

export const { setAuthToken, setProfile, logout } = userSlice.actions;

// Selector umum untuk token, status autentikasi, dan data user
export const selectAuthToken = (state: RootState) => state.user.token;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.user.profile; // Ini adalah data profil user
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;