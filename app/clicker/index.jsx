'use client';
import './clicker.scss';
import React, { useState, useEffect } from "react";
import { useGlobalContext } from '../GlobalState';  
import { incrementCount } from '../api';  

export default function Clicker() {
    const { state } = useGlobalContext();  
    const [tapCount, setTapCount] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null); 
    const [totalCount, setTotalCount] = useState(state.count);  
    const userToken = localStorage.getItem("userToken");  
    const updateTotalCount = () => {
        setTotalCount(state.count + tapCount);  
    };

    const handleTap = () => {
        setTapCount((prev) => prev + 1);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
            setTapCount((prevTapCount) => {
                if (prevTapCount > 0) {
                    incrementCount(userToken, prevTapCount);  
                    localStorage.setItem("userCount", state.count + prevTapCount);
                }
                return prevTapCount; 
            });
        }, 2000);

        setTimeoutId(newTimeoutId);  
    };
    useEffect(() => {
        updateTotalCount();
    }, [state.count, tapCount]); 
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <div className="clicker-container">
            <h1>Click Master</h1>
            <p className="counter-display">{totalCount}</p>  {/* Отображаем итоговое значение */}
            <button role="button" className="button-92" onClick={handleTap}>
                Tap
            </button>
        </div>
    );
}
