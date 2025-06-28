import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {createSession, createUser} from "../api/moviesApi";

export const asyncCreateUser = createAsyncThunk('auth/createUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await createUser(userData);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
});

export const asyncLogin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const token = await createSession(credentials);
        return token;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to login');
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncCreateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncCreateUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(asyncCreateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(asyncLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(asyncLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
