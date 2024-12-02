'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './registr.scss';
import { registerUser } from '../api'; 
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const id = Date.now().toString();

      const success = await registerUser(email, username, password, id);
      if (success) {
        toast.success('Registration successful');
        setTimeout(() => {
          router.push('/login');
        }, 3000)
      } else {
        toast.error('Email is already taken');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed');
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
      <h1 className="auth-title">Register</h1>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">Register</button>
      </form>
      <p className="auth-text">Already have an account? <a href="/login" className="auth-link">Login</a></p>
    </div>
  );
}
