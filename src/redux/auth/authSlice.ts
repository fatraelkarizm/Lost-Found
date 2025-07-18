// @/redux/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import axios from 'axios';
import { setProfile} from '@/redux/user/userSlice'; // <<< Import setProfile & clearUserProfile dari userSlice >>>

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status untuk operasi autentikasi
    error: string | null; // Error untuk operasi autentikasi
}

const initialState: AuthState = {
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    status: 'idle',
    error: null,
};

interface LoginResponseData {
    id: string;
    email: string;
    name: string;
    username: string | null;
    photoprofile: string | null;
    isAdmin: boolean;
    token: string;
    city?: string | null;
    province?: string | null;
}

export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (id_token: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8889/login', { id_token });
            const data = response.data.data as LoginResponseData;

            dispatch(authSlice.actions.setAuthToken(data.token));
            const { token, ...profileData } = data;
            dispatch(setProfile(profileData)); // Dispatch data profil ke userSlice

            return data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to login with Google');
            }
            return rejectWithValue('An unexpected error occurred during Google login');
        }
    }
);

export const loginWithEmailPassword = createAsyncThunk(
    'auth/loginWithEmailPassword',
    async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8889/api/login/email', {
                email: credentials.email,
                password: credentials.password,
            });
            const data = response.data.data as LoginResponseData;

            dispatch(authSlice.actions.setAuthToken(data.token));
            const { token, ...profileData } = data;
            dispatch(setProfile(profileData)); // Dispatch data profil ke userSlice

            return data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to login with email and password');
            }
            return rejectWithValue('An unexpected error occurred during email/password login');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
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
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
            // Catatan: clearUserProfile harus didispatch secara terpisah di komponen/App.tsx
            // untuk membersihkan data profil dari userProfileSlice.
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, _action: PayloadAction<LoginResponseData>) => {
                state.status = 'succeeded';
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Login failed';
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('authToken');
            })

            .addCase(loginWithEmailPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginWithEmailPassword.fulfilled, (state, _action: PayloadAction<LoginResponseData>) => {
                state.status = 'succeeded';
            })
            .addCase(loginWithEmailPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Login failed';
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('authToken');
            });
    },
});

export const { setAuthToken, logout } = authSlice.actions;

export const selectAuthToken = (state: RootState): AuthState['token'] => (state as RootState).auth.token;
export const selectIsAuthenticated = (state: RootState): AuthState['isAuthenticated'] => (state as RootState).auth.isAuthenticated;
export const selectAuthStatus = (state: RootState): AuthState['status'] => (state as RootState).auth.status;
export const selectAuthError = (state: RootState): AuthState['error'] => (state as RootState).auth.error;

export default authSlice.reducer;