// @/redux/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import axios from 'axios';
import { setProfile } from '@/redux/user/userSlice'; 

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
};

// Interface untuk respons data dari API login
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


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (id_token: string, { dispatch, rejectWithValue }) => { 
        try {
            const response = await axios.post('http://localhost:8889/api/login', { id_token });
            const data = response.data.data as LoginResponseData;

            dispatch(setAuthToken(data.token));
            const { token, ...profileData } = data; 
            dispatch(setProfile(profileData));

            return data; 
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.errors || 'Failed to login');
            }
            return rejectWithValue('An unexpected error occurred');
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponseData>) => {
                state.status = 'succeeded';
                state.token = action.payload.token; 
                state.isAuthenticated = true;
                localStorage.setItem('authToken', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Login failed';
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('authToken');
            });
    }
});

export const { setAuthToken, logout } = authSlice.actions; // setUserData dihapus

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;