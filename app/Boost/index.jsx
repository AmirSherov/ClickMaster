'use client';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../GlobalState';
import './boost.scss';

const BOOST_DURATION = 15; 

export default function Boost() {
    const { state, dispatch } = useGlobalContext();
    const [timeLeft, setTimeLeft] = useState(BOOST_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        if (state.multiply > 1) {
            setIsActive(true);
            setTimeLeft(BOOST_DURATION);
        }
    }, [state.multiply]);

    useEffect(() => {
        let interval = null;
        let warningInterval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        clearInterval(warningInterval);
                        setIsActive(false);
                        setTimeout(() => {
                            dispatch({ type: 'SET_MULTIPLY', payload: 1 });
                        }, 0);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            if (timeLeft <= 5) {
                warningInterval = setInterval(() => {
                    setIsWarning(prev => !prev);
                }, 500);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
            if (warningInterval) clearInterval(warningInterval);
        };
    }, [isActive, timeLeft, dispatch]);

    if (!isActive || timeLeft <= 0) return null;

    const progress = (timeLeft / BOOST_DURATION) * 100;

    return (
        <div className={`boost-container ${isWarning ? 'warning' : ''}`}>
            <div className="boost-timer">
                <span className="boost-multiplier">x{state.multiply}</span>
                <span className="boost-time">{timeLeft}с</span>
            </div>
            <div className="boost-progress-container">
                <div 
                    className="boost-progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}