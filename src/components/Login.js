import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Alert, CircularProgress } from '@mui/material';
import { asyncLogin } from '../store/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log('Login data:', data);
        const result = await dispatch(asyncLogin(data));
        if (asyncLogin.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="sm">
            <h2>Login</h2>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="form" sx={{ mt: 3 }}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button type="submit" className="gradient-button" disabled={loading} sx={{ mt: 2 }}>
                    Login
                </Button>
                {loading && <CircularProgress sx={{ mt: 2 }} />}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof error === 'object' && error.code === 'INVALID_CREDENTIALS'
                            ? 'Invalid email or password'
                            : error || 'Failed to login'}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default Login;
