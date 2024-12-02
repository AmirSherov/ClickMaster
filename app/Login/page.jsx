'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.scss';
import { getUserByUsernameAndPassword } from '../api';
import { toast, Toaster } from 'react-hot-toast';
import Loading from "../loading";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUserByUsernameAndPassword(email, password);

      if (user) {
        toast.success('Login successful');
        localStorage.setItem('userToken', user.id);
        setTimeout(() => {
          router.push('/');
        }, 2000); 
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false); 
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="auth-container">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'black',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '16px',
          },
        }}
      />
      <h1 className="auth-title">Login</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button
          type="submit"
          className="auth-button"
          disabled={!email || !password || !validateEmail(email)} 
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="auth-text">
        Don't have an account? <a href="/Registration" className="auth-link">Register</a>
      </p>
      {loading && <Loading />}
    </div>
  );
}
