'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './registr.scss';
import { registerUser } from '../api';
import { toast, Toaster } from 'react-hot-toast';
import Loading from "../loading";

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
      setCurrentDate(formattedDate);
    }
  }, []); 

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    if (username.length < 3 || username.length > 8) {
      toast.error("Username must be between 3 and 8 characters");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const id = Date.now().toString(); 
      if (!currentDate) {
        toast.error('Could not fetch current date');
        setLoading(false);
        return;
      }
      const success = await registerUser(email, username, password, id, currentDate);

      if (success) {
        toast.success('Registration successful');
        setTimeout(() => {
          router.push('/Login');
        }, 4000);
      } else {
        toast.error('Email is already taken');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed');
    } finally {
      setLoading(false);
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="text"
          placeholder="Username (3-8 characters)"
          value={username}
          maxLength={8}
          minLength={3}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password (8 characters)"
          value={password}
          minLength={8}
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
        <button type="submit" className="auth-button" disabled={loading}>Register</button>
      </form>
      <p className="auth-text">Already have an account? <a href="/Login" className="auth-link">Login</a></p>
      {loading && <Loading />}
    </div>
  );
}
