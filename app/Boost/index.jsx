'use client';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../GlobalState';
import styles from './boost.module.scss';

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
       <div className={`${styles.boostContainer} ${isWarning ? styles.warningActive : ''}`}>
            <div className={styles.boostTimer}>
                <span className={styles.boostMultiplier}>x{state.multiply}</span>
                <span className={styles.boostTime}>{timeLeft}s</span>
            </div>
            <div className={styles.boostProgressContainer}>
                <div
                    className={styles.boostProgressBar}
                    style={{
                        width: `${progress}%`
                    }}
                />
            </div>
        </div>
    );
}