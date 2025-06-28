import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

export const createUser = async (userData) => {
    const response = await api.post('/users', {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
    });
    console.log('createUser response:', response.data);
    return response.data;
};

export const createSession = async (credentials) => {
    const response = await api.post('/sessions', {
        email: credentials.email,
        password: credentials.password,
    });
    console.log('createSession response:', response.data);
    const token = response.data.token || response.data;
    return typeof token === 'string' ? token : '';
};

export const getMovies = async (token) => {
    console.log('getMovies token:', token);
    const response = await api.get('/movies?limit=100&offset=0', {
        headers: { Authorization: token },
    });
    console.log('getMovies response:', response.data);
    return response.data.data || response.data;
};

export const getMovieById = async (id, token) => {
    console.log('getMovieById token:', token);
    const response = await api.get(`/movies/${id}`, {
        headers: { Authorization: token },
    });
    console.log('getMovieById response:', response.data);
    return response.data.data || response.data;
};

export const addMovie = async (movie, token) => {
    console.log('Sending movie:', movie);
    console.log('addMovie token:', token);
    const response = await api.post('/movies', movie, {
        headers: { Authorization: token },
    });
    console.log('Add movie response:', response.data);
    return response.data.data || response.data;
};

export const deleteMovie = async (id, token) => {
    console.log('deleteMovie token:', token);
    await api.delete(`/movies/${id}`, {
        headers: { Authorization: token },
    });
    console.log('deleteMovie response: Success');
    return id;
};

export const importMovies = async (file, token) => {
    console.log('Importing file:', { name: file.name, size: file.size, type: file.type });
    console.log('importMovies token:', token);
    const formData = new FormData();
    formData.append('movies', file);
    try {
        const response = await api.post('/movies/import', formData, {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Import movies response:', response.data);
        return response.data.data || response.data;
    } catch (error) {
        console.error('Import movies error:', error.response?.data || error.message);
        throw error;
    }
};

export const searchMoviesByTitle = async (title, token) => {
    console.log('searchMoviesByTitle title:', title);
    console.log('searchMoviesByTitle token:', token);
    const response = await api.get(`/movies?title=${encodeURIComponent(title)}`, {
        headers: { Authorization: token },
    });
    console.log('searchMoviesByTitle response:', response.data);
    return response.data.data || response.data;
};

export const searchMoviesByActor = async (actor, token) => {
    console.log('searchMoviesByActor actor:', actor);
    console.log('searchMoviesByActor token:', token);
    const response = await api.get(`/movies?actor=${encodeURIComponent(actor)}`, {
        headers: { Authorization: token },
    });
    console.log('searchMoviesByActor response:', response.data);
    return response.data.data || response.data;
};
