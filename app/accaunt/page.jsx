'use client';
import Nav from '../nav';
import style from  './accaunt.module.scss';
import Modal from '../Modal';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../GlobalState';
import { useRouter } from 'next/navigation';
import { updateUserFieldById } from '../api';
import { IoCheckmark } from "react-icons/io5";
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
    const Achives = {
        "Tap 1 000 click": 1000,
        "Tap 5 000 click": 5000,
        "Tap 10 000 click": 10000,
        "Tap 30 000 click": 30000,
        "Tap 50 000 click": 50000,
        "Tap 100 000 click": 100000,
        "Tap 5 000 000 click": 5000000,
    }
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
    function UpdateUserField(id, field, value) {
        updateUserFieldById(id, field, value);
    }
    function formatNumber(number) {
        return new Intl.NumberFormat('ru-RU').format(number);
    }
    const currentCount = state.count;
    return (
        <div className={style.accauntContainer}>
            <h1>Account Information</h1>
            <div className={style.userDetails}>
                <div className={  style.userItem}>
                    <p>Username:</p>
                    <p>{state.userName}</p>
                </div>
                <div className={style.userItem}>
                    <p>Email:</p>
                    <p>{maskEmail(state.email)}</p>
                </div>
                <div className={ style.userItem}>
                    <p>Balance:</p>
                    <p>{formatNumber(state.count)}</p>
                </div>
                <div className={ style.userItem }>
                    <p>Registration Date:</p>
                    <p>{state.date}</p>
                </div>
            </div>
            <div className={style.setting}>
                <h1>Settings</h1>
                <div className={style.settingItems}>
                    <div className={style.settingItem}>
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
                        <div><div className={style.sliderSetting}></div></div>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(true)} className={style.logout}>Logout</button>
            <Nav />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => logout()} text="Are you sure you want to log out?" />
            <div className={style.achivesContainer}>
                <h1>Account Achives</h1>
                <div className={style.achivesItems}>
                    {Object.entries(Achives).map(([key, value]) => {
                        const isAchieved = currentCount >= value;
                        const progressPercentage = (currentCount / value) * 100;

                        return (
                            <div key={value} className={style.itemAchive}>
                                <p>{key}</p>
                                <div className={style.progressBarAchive}>
                                    <div className={style.progressAchive} style={{ width: `${isAchieved ? 100 : progressPercentage}%` }}></div>
                                </div>
                                {isAchieved && <span className={style.checkmarkAchive}>< IoCheckmark /></span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
