import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Alert, CircularProgress } from '@mui/material';
import { asyncCreateUser } from '../store/authSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log('Register data:', data);
        const result = await dispatch(asyncCreateUser(data));
        if (asyncCreateUser.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    const password = watch('password');

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
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
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                    Register
                </Button>
                {loading && <CircularProgress sx={{ mt: 2 }} />}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof error === 'object' && error.code === 'USER_EXISTS'
                            ? 'User with this email already exists'
                            : error || 'Failed to register'}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default Register;
