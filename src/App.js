import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MovieList from './components/MovieList';
import AddMovieForm from './components/AddMovieForm';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import Register from './components/Register';
import { Container, Button, Box, TextField, MenuItem, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { logout } from './store/authSlice';
import { asyncFetchMovies, asyncSearchMoviesByTitle, asyncSearchMoviesByActor, clearSearchResults, asyncImportMovies } from './store/moviesSlice';

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { loading, error } = useSelector((state) => state.movies);
    const fileInputRef = useRef(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            searchType: 'title',
            query: '',
        },
    });

    const handleRefreshMovies = () => {
        if (token) {
            dispatch(asyncFetchMovies());
            dispatch(clearSearchResults());
        }
    };

    const onSearch = (data) => {
        console.log('Search data:', data);
        if (data.searchType === 'title') {
            dispatch(asyncSearchMoviesByTitle(data.query));
        } else {
            dispatch(asyncSearchMoviesByActor(data.query));
        }
    };

    const handleClearSearch = () => {
        dispatch(clearSearchResults());
        reset({
            searchType: 'title',
            query: '',
        });
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', { name: file.name, size: file.size, type: file.type });
            const result = await dispatch(asyncImportMovies(file));
            if (asyncImportMovies.fulfilled.match(result)) {
                dispatch(asyncFetchMovies());
            }
            fileInputRef.current.value = '';
        }
    };

    return (
        <Router>
            <Container>
                <h1>Movies App</h1>
                <Box className="form" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button className="gradient-button" component={Link} to="/">
                        Home
                    </Button>
                    {token && (
                        <>
                            <Button className="gradient-button" component={Link} to="/add-movie">
                                Add Movie
                            </Button>
                            <Button className="gradient-button" onClick={handleRefreshMovies}>
                                Refresh Movies
                            </Button>
                            <Button className="gradient-button" onClick={handleImportClick} disabled={loading}>
                                Import
                            </Button>
                            <input
                                type="file"
                                accept=".txt"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                    {!token && (
                        <>
                            <Button className="gradient-button" component={Link} to="/login">
                                Login
                            </Button>
                            <Button className="gradient-button" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                    {token && (
                        <Button className="gradient-button" onClick={() => dispatch(logout())}>
                            Logout
                        </Button>
                    )}
                    {token && (
                        <Box component="form" onSubmit={handleSubmit(onSearch)} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <TextField
                                select
                                label="Search By"
                                size="small"
                                {...register('searchType', { required: 'Please select a search type' })}
                                error={!!errors.searchType}
                                helperText={errors.searchType?.message}
                            >
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="actor">Actor</MenuItem>
                            </TextField>
                            <TextField
                                label="Search Query"
                                size="small"
                                {...register('query', { required: 'Search query is required' })}
                                error={!!errors.query}
                                helperText={errors.query?.message}
                            />
                            <Button className="gradient-button" type="submit">
                                Search
                            </Button>
                            <Button className="gradient-button" onClick={handleClearSearch}>
                                Clear
                            </Button>
                        </Box>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {typeof error === 'object' && error.code === 'FILE_INVALID'
                            ? 'Invalid file format. Ensure the file follows the format: Title, Release Year, Format, Stars.'
                            : error || 'An error occurred'}
                    </Alert>
                )}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-movie" element={<AddMovieForm />} />
                    <Route
                        path="/"
                        element={
                            token ? (
                                <MovieList />
                            ) : (
                                <Login />
                            )
                        }
                    />
                    <Route path="/movies/:id" element={<MovieDetails />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
