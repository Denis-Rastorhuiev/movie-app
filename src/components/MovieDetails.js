import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { asyncFetchMovieById } from '../store/moviesSlice';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

const MovieDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedMovie, loading, error } = useSelector((state) => state.movies);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && id) {
            dispatch(asyncFetchMovieById(id));
        }
    }, [dispatch, id, token]);

    if (!token) return <Alert severity="warning">Please log in to view movie details.</Alert>;
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!selectedMovie) return <Alert severity="info">Movie not found.</Alert>;

    const actorsList = Array.isArray(selectedMovie.actors)
        ? selectedMovie.actors.map((actor) => (typeof actor === 'object' && actor.name ? actor.name : actor)).join(', ')
        : typeof selectedMovie.actors === 'string'
            ? selectedMovie.actors
            : 'No actors';
    console.log('Movie details actors:', selectedMovie.actors);

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h4">{selectedMovie.title}</Typography>
            <Typography variant="body1">Year: {selectedMovie.year}</Typography>
            <Typography variant="body1">Format: {selectedMovie.format}</Typography>
            <Typography variant="body1">Actors: {actorsList}</Typography>
        </Container>
    );
};

export default MovieDetails;
