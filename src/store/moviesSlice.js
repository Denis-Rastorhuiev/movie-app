import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getMovies,
    getMovieById,
    addMovie,
    deleteMovie,
    importMovies,
    searchMoviesByTitle,
    searchMoviesByActor,
} from '../api/moviesApi';

export const asyncFetchMovies = createAsyncThunk('movies/fetchMovies', async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await getMovies(token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch movies');
    }
});

export const asyncAddMovie = createAsyncThunk('movies/addMovie', async (movie, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await addMovie(movie, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to add movie');
    }
});

export const asyncDeleteMovie = createAsyncThunk('movies/deleteMovie', async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await deleteMovie(id, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to delete movie');
    }
});

export const asyncSearchMoviesByTitle = createAsyncThunk('movies/searchMoviesByTitle', async (title, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await searchMoviesByTitle(title, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to search movies by title');
    }
});

export const asyncSearchMoviesByActor = createAsyncThunk('movies/searchMoviesByActor', async (actor, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await searchMoviesByActor(actor, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to search movies by actor');
    }
});

export const asyncFetchMovieById = createAsyncThunk('movies/fetchMovieById', async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await getMovieById(id, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch movie');
    }
});

export const asyncImportMovies = createAsyncThunk('movies/importMovies', async (file, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        return await importMovies(file, token);
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to import movies');
    }
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        searchResults: [],
        selectedMovie: null,
        loading: false,
        error: null,
        isSearchActive: false,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.isSearchActive = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncFetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncFetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(asyncFetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.movies = [];
            })
            .addCase(asyncAddMovie.fulfilled, (state, action) => {
                const newMovie = action.payload;
                if (newMovie && newMovie.id && newMovie.title && newMovie.year && newMovie.format) {
                    state.movies.push(newMovie);
                } else {
                    console.warn('Invalid movie data:', newMovie);
                }
            })
            .addCase(asyncAddMovie.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(asyncDeleteMovie.fulfilled, (state, action) => {
                state.movies = state.movies.filter((movie) => movie.id !== action.payload);
                state.searchResults = state.searchResults.filter((movie) => movie.id !== action.payload);
            })
            .addCase(asyncDeleteMovie.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(asyncSearchMoviesByTitle.fulfilled, (state, action) => {
                state.searchResults = Array.isArray(action.payload) ? action.payload : [];
                state.isSearchActive = true;
            })
            .addCase(asyncSearchMoviesByTitle.rejected, (state, action) => {
                state.error = action.payload;
                state.isSearchActive = false;
            })
            .addCase(asyncSearchMoviesByActor.fulfilled, (state, action) => {
                state.searchResults = Array.isArray(action.payload) ? action.payload : [];
                state.isSearchActive = true;
            })
            .addCase(asyncSearchMoviesByActor.rejected, (state, action) => {
                state.error = action.payload;
                state.isSearchActive = false;
            })
            .addCase(asyncFetchMovieById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncFetchMovieById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload;
            })
            .addCase(asyncFetchMovieById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(asyncImportMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(asyncImportMovies.fulfilled, (state, action) => {
                state.loading = false;
                const newMovies = Array.isArray(action.payload) ? action.payload : [];
                state.movies.push(...newMovies);
            })
            .addCase(asyncImportMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSearchResults } = moviesSlice.actions;
export default moviesSlice.reducer;
