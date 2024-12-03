'use client';
import Nav from '../nav';
import './accaunt.scss';
import Modal from '../Modal';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../GlobalState';
import { useRouter } from 'next/navigation';

export default function Account() {
    const [isOpen, setIsOpen] = useState(false);
    const { state, dispatch } = useGlobalContext();
    const router = useRouter();

    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 2) + '**';
        return `${maskedLocalPart}@${domain}`;
    };
    function logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userCount');
        }
        dispatch({ type: 'SET_USER_NAME', payload: '' });
        dispatch({ type: 'SET_USER_COUNT', payload: 0 });
        dispatch({ type: 'SET_USER_DATE', payload: '' });
        dispatch({ type: 'SET_USER_EMAIL', payload: '' });
        setIsOpen(false);
        window.location.href = '/Login';
    }

    return (
        <div className="account-container">
            <h1>Account Information</h1>
            <div className="user-details">
                <p><strong>Username:</strong>{state.userName}</p>
                <p><strong>Registration Date:</strong>{state.date}</p>
                <p><strong>Email:</strong> <span className="email-mask">{maskEmail(state.email)}</span></p>
                <button onClick={() => setIsOpen(true)} className='logout'>Logout</button>
            </div>
            <Nav />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => logout()} text="Are you sure you want to log out?" />
        </div>
    );
}
