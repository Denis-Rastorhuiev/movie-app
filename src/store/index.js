import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        auth: authReducer,
    },
});
