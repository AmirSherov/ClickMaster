'use client';
import './clicker.scss';
import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from '../GlobalState';
import { incrementCount } from '../api';


import dynamic from 'next/dynamic';

const Clicker = () => {
    const { state, dispatch } = useGlobalContext();
    const [tapCount, setTapCount] = useState(0);
    const [userToken, setUserToken] = useState(null);
    const timeoutRef = useRef(null);
    const [isVibration, setIsVibration] = useState(state.vibration);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem("userToken");
            const storedCount = localStorage.getItem("userCount");

            setUserToken(storedToken);

            if (storedCount) {
                dispatch({ type: 'UPDATE_COUNT', payload: parseInt(storedCount, 10) });
            }
        }
    }, [dispatch]);

    const handleTap = (event) => {
        event.preventDefault();
        if (isVibration) {
            navigator.vibrate(100);
        }
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);
        const updatedCount = (state.count || 0) + 1;

        localStorage.setItem("userCount", updatedCount);

        dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (userToken && newTapCount > 0) {
                incrementCount(userToken, newTapCount)
                    .then((updatedCount) => {
                        if (typeof updatedCount === 'number') {
                            dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
                            localStorage.setItem("userCount", updatedCount);
                        }
                    })
                    .catch((err) => console.error('API error:', err))
                    .finally(() => setTapCount(0));
            }
        }, 400);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const displayCount = state.count || parseInt(localStorage.getItem("userCount"), 10) || 0;

    return (
        <div className="clicker-container">
            <h1>Click Master</h1>
            <p className="counter-display">{displayCount}</p>
            <button
                role="button"
                className="button-92"
                onPointerDown={handleTap}
            >
                Tap
            </button>
        </div>
    );
}

export default dynamic(() => Promise.resolve(Clicker), { ssr: false });
