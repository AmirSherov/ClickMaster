'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.scss';
import { getUserByUsernameAndPassword } from '../api';
import { toast, Toaster } from 'react-hot-toast';
import Loading from "../loading";

const REDIRECT_DELAY = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toastConfig = {
    position: "top-right",
    toastOptions: {
        duration: 5000,
        style: {
            background: 'black',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '16px',
        },
    }
};

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateEmail = useCallback((email) => {
        return EMAIL_REGEX.test(email);
    }, []);

    const isFormValid = useMemo(() => {
        const { email, password } = formData;
        return email && password && validateEmail(email);
    }, [formData, validateEmail]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            toast.error('Please check your email and password');
            return;
        }

        setIsLoading(true);

        try {
            const user = await getUserByUsernameAndPassword(
                formData.email,
                formData.password
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            toast.success('Login successful');
            localStorage.setItem('userToken', user.id);
            
            // Используем Promise для более чистой обработки задержек
            await new Promise(resolve => setTimeout(resolve, REDIRECT_DELAY));
            router.push('/');

        } catch (error) {
            console.error('Login error:', error);
            toast.error(
                error.message === 'Invalid credentials'
                    ? 'Invalid email or password'
                    : 'An error occurred during login'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Toaster {...toastConfig} />
            
            <h1 className="auth-title">Login</h1>
            
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`auth-input ${
                            formData.email && !validateEmail(formData.email) ? 'error' : ''
                        }`}
                        disabled={isLoading}
                        required
                        autoComplete="email"
                    />
                    {formData.email && !validateEmail(formData.email) && (
                        <span className="error-message">Please enter a valid email</span>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="auth-input"
                        disabled={isLoading}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="auth-text">
                Don't have an account?{' '}
                <Link href="/Registration" className="auth-link">
                    Register
                </Link>
            </p>

            {isLoading && <Loading />}
        </div>
    );
}