import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Container,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import { asyncSearchMoviesByTitle, asyncSearchMoviesByActor, clearSearchResults } from '../store/moviesSlice';

const SearchMovie = () => {
    const dispatch = useDispatch();
    const { searchResults, loading, error } = useSelector((state) => state.movies);
    const { token } = useSelector((state) => state.auth);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            searchType: 'title',
            query: '',
        },
    });

    const onSubmit = (data) => {
        console.log('Search data:', data);
        if (data.searchType === 'title') {
            dispatch(asyncSearchMoviesByTitle(data.query));
        } else {
            dispatch(asyncSearchMoviesByActor(data.query));
        }
    };

    const handleClear = () => {
        dispatch(clearSearchResults());
        reset({
            searchType: 'title',
            query: '',
        });
    };

    if (!token) {
        return <Alert severity="warning">Please log in to search movies.</Alert>;
    }

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <TextField
                    select
                    label="Search By"
                    fullWidth
                    margin="normal"
                    defaultValue="title"
                    {...register('searchType', { required: 'Please select a search type' })}
                    error={!!errors.searchType}
                    helperText={errors.searchType?.message}
                >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="actor">Actor</MenuItem>
                </TextField>
                <TextField
                    label="Search Query"
                    fullWidth
                    margin="normal"
                    {...register('query', { required: 'Search query is required' })}
                    error={!!errors.query}
                    helperText={errors.query?.message}
                />
                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mr: 1 }}
                    >
                        Search
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClear} disabled={loading}>
                        Clear
                    </Button>
                </Box>
            </Box>
            {loading && <CircularProgress sx={{ mt: 2 }} />}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {typeof error === 'object' && error.code === 'WRONG_TOKEN'
                        ? 'Invalid or expired token. Please log in again.'
                        : typeof error === 'object' && error.code === 'FORMAT_ERROR'
                            ? 'Invalid search query format. Please check your input.'
                            : error || 'Failed to search movies'}
                </Alert>
            )}
            {searchResults.length > 0 && (
                <Table sx={{ mt: 3 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Format</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.map((movie) => (
                            <TableRow key={movie.id || movie.title}>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell>{movie.year}</TableCell>
                                <TableCell>{movie.format}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {searchResults.length === 0 && !loading && !error && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No results found.
                </Alert>
            )}
        </Container>
    );
};

export default SearchMovie;
