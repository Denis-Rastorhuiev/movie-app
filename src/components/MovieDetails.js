import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { asyncFetchMovieById } from '../store/moviesSlice';
import { Container, CircularProgress, Alert } from '@mui/material';

const MovieDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedMovie, loading, error } = useSelector((state) => state.movies);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && id) {
            dispatch(asyncFetchMovieById(id));
        }
    }, [dispatch, token, id]);

    if (!token) return <Alert severity="warning" sx={{ mb: 2 }}>Please log in to view movie details.</Alert>;
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
    if (!selectedMovie) return <Alert severity="info" sx={{ mb: 2 }}>Movie not found.</Alert>;

    // Перетворюємо масив акторів у рядок імен
    const actorsString = Array.isArray(selectedMovie.actors)
        ? selectedMovie.actors.map(actor => actor.name).join(', ')
        : 'No actors available';

    return (
        <Container maxWidth="sm">
            <h2>{selectedMovie.title}</h2>
            <p><strong>Year:</strong> {selectedMovie.year}</p>
            <p><strong>Format:</strong> {selectedMovie.format}</p>
            <p><strong>Actors:</strong> {actorsString}</p>
        </Container>
    );
};

export default MovieDetails;
