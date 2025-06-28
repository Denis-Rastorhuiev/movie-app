import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Container, Box, Alert } from '@mui/material';
import { asyncAddMovie } from '../store/moviesSlice';

const AddMovieForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.movies);
    const { token } = useSelector((state) => state.auth);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const movie = {
            title: data.title,
            year: parseInt(data.year, 10),
            format: data.format,
            actors: data.actors.split(',').map((actor) => actor.trim()),
        };
        console.log('Submitting movie:', movie);
        console.log('Token in AddMovieForm:', token);
        const result = await dispatch(asyncAddMovie(movie));
        if (asyncAddMovie.fulfilled.match(result)) {
            reset();
            navigate('/');
        }
    };

    if (!token) return <Alert severity="warning">Please log in to add movies.</Alert>;

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    {...register('title', {
                        required: 'Title is required',
                        minLength: {
                            value: 2,
                            message: 'Title must be at least 2 characters long',
                        },
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
                <TextField
                    label="Release Year"
                    type="number"
                    fullWidth
                    margin="normal"
                    {...register('year', {
                        required: 'Year is required',
                        min: { value: 1888, message: 'Year must be after 1888' },
                        max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                    })}
                    error={!!errors.year}
                    helperText={errors.year?.message}
                />
                <TextField
                    select
                    label="Format"
                    fullWidth
                    margin="normal"
                    defaultValue=""
                    {...register('format', { required: 'Format is required' })}
                    error={!!errors.format}
                    helperText={errors.format?.message}
                >
                    <MenuItem value="VHS">VHS</MenuItem>
                    <MenuItem value="DVD">DVD</MenuItem>
                    <MenuItem value="Blu-ray">Blu-ray</MenuItem>
                </TextField>
                <TextField
                    label="Actors (comma-separated)"
                    fullWidth
                    margin="normal"
                    {...register('actors', { required: 'At least one actor is required' })}
                    error={!!errors.actors}
                    helperText={errors.actors?.message}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                    Add Movie
                </Button>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof error === 'object' && error.code === 'WRONG_TOKEN'
                            ? 'Invalid or expired token. Please log in again.'
                            : error || 'Failed to add movie'}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default AddMovieForm;
