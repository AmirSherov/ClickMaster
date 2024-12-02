'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.scss';
import { getUserByUsernameAndPassword } from '../api';
import { toast, Toaster } from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await getUserByUsernameAndPassword(username, parseInt(password));

      if (user) {
        toast.success('Login successful');
        router.push('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
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
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-text">
        Don't have an account? <a href="/Registration" className="auth-link">Register</a>
      </p>
    </div>
  );
}
