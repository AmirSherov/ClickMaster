'use client';
import './clicker.scss';
import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from '../GlobalState';
import { incrementCount } from '../api';

export default function Clicker() {
    const { state, dispatch } = useGlobalContext();
    const [tapCount, setTapCount] = useState(0); 
    const [userToken, setUserToken] = useState(null); 
    const timeoutRef = useRef(null); 

    useEffect(() => {
        if (userToken === null && typeof window !== 'undefined') {
            const storedToken = localStorage.getItem("userToken");
            setUserToken(storedToken);
        }
        const storedCount = parseInt(localStorage.getItem("userCount"), 10);
        if (!isNaN(storedCount)) {
            dispatch({ type: 'UPDATE_COUNT', payload: storedCount });
        }
    }, [userToken, dispatch]);

    const handleTap = (event) => {
        event.preventDefault();
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        const updatedDisplayCount = (state.count || 0) + newTapCount;
        localStorage.setItem("userCount", updatedDisplayCount);

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
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const displayCount = localStorage.getItem("userCount") || state.count || 0;

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
