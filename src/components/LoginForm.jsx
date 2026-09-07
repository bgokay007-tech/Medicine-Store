import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { request } from '../api';
import Icon from './Icon';

const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { email: '', password: '' },
    });
    const onSubmit = async (values) => {
        setServerError('');
        try {
            const data = await request('/user/login', { method: 'POST', body: JSON.stringify(values) });
            localStorage.setItem('ep_token', data.token);
            if (data.refreshToken) localStorage.setItem('ep_refresh', data.refreshToken);
            navigate('/home');
        } catch (error) { setServerError(error.message); }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <label>
                <span className="sr-only">Email address</span>
                <input type="email" placeholder="Email address" autoComplete="email" {...register('email')} />
                {errors.email ? <small>{errors.email.message}</small> : <small aria-hidden="true">&nbsp;</small>}
            </label>
            <label>
                <span className="sr-only">Password</span>
                <div className="password-input">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" {...register('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                    </button>
                </div>
                {errors.password ? <small>{errors.password.message}</small> : <small aria-hidden="true">&nbsp;</small>}
            </label>
            {serverError && <div className="form-error">{serverError}</div>}
            <button className="login-submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Log In Now'}</button>
        </form>
    );
}
