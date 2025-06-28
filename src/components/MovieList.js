import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncFetchMovies, asyncDeleteMovie } from '../store/moviesSlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, CircularProgress, Alert } from '@mui/material';

const MovieList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { movies, searchResults, isSearchActive, loading, error } = useSelector((state) => state.movies);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !isSearchActive) {
            dispatch(asyncFetchMovies());
        }
    }, [dispatch, token, isSearchActive]);

    const handleRowClick = (id) => {
        navigate(`/movies/${id}`);
    };

    if (!token) return <Alert severity="warning" sx={{ mb: 2 }}>Please log in to view movies.</Alert>;
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;

    const displayMovies = isSearchActive && searchResults.length > 0
        ? [...searchResults].sort((a, b) => a.title.localeCompare(b.title))
        : Array.isArray(movies)
            ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
            : [];
    console.log('Display movies:', displayMovies);

    if (displayMovies.length === 0) {
        return <Alert severity="info" sx={{ mb: 2 }}>No movies found.</Alert>;
    }

    return (
        <Container>
            <h2>{isSearchActive ? 'Search Results' : 'Movies List'}</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Format</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayMovies.map((movie) => (
                        <TableRow
                            key={movie.id || movie.title}
                            className="table-row"
                            onClick={() => handleRowClick(movie.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>{movie.year}</TableCell>
                            <TableCell>{movie.format}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <Button
                                    className="gradient-button"
                                    variant="contained"
                                    color="error"
                                    onClick={() => dispatch(asyncDeleteMovie(movie.id))}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default MovieList;
