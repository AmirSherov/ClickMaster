'use client';
import Nav from '../nav';
import './accaunt.scss';
import Modal from '../Modal';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../GlobalState';
import { useRouter } from 'next/navigation';
import { updateUserFieldById } from '../api';
export default function Account() {
    const [isOpen, setIsOpen] = useState(false);
    const { state, dispatch } = useGlobalContext();
    const [isVibration, setIsVibration] = useState(state.vibration);
    const router = useRouter();
    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            router.push('/Login');
        }
    }, [router]);
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
        router.push('/Login');
    }
    function UpdateUserField(id , field , value) {
        setTimeout(() => {
            updateUserFieldById(id, field, value);
        }, 2000);
    }
    return (
        <div className="account-container">
            <h1>Account Information</h1>
            <div className="user-details">
                <div className="item">
                    <p>Username:</p>
                    <p>{state.userName}</p>
                </div>
                <div className="item">
                    <p>Email:</p>
                    <p>{maskEmail(state.email)}</p>
                </div>
                <div className="item">
                    <p>Balance:</p>
                    <p>{state.count}</p>
                </div>
                <div className="item">
                    <p>Registration Date:</p>
                    <p>{state.date}</p>
                </div>
            </div>
            <div className="setting">
                <h1>Settings</h1>
                <div className="setting-items">
                    <div className="item">
                        <div>Vibration</div>
                        <input
                            type="checkbox"
                            checked={isVibration}
                            onChange={() => {
                                const newVibrationState = !isVibration;
                                setIsVibration(newVibrationState);
                                dispatch({ type: 'SET_VIBRATION', payload: newVibrationState })
                                UpdateUserField(state.id, 'vibration', newVibrationState);
                            }}
                        />
                        <div><div className='slider-setting'></div></div>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(true)} className='logout'>Logout</button>
            <Nav />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => logout()} text="Are you sure you want to log out?" />
        </div>
    );
}
