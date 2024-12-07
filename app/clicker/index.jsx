'use client';
import './clicker.scss';
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGlobalContext } from '../GlobalState';
import { incrementCount } from '../api';
import ProgressBar from '../progressbar';
import dynamic from 'next/dynamic';
import { GiUpgrade } from "react-icons/gi";
import { useRouter } from 'next/navigation';

const DEBOUNCE_DELAY = 400;

const RANKS = [
    { name: "Новичок", threshold: 0 },
    { name: "Ученик", threshold: 100 },
    { name: "Адепт", threshold: 500 },
    { name: "Мастер", threshold: 2000 },
    { name: "Гранд-мастер", threshold: 5000 },
    { name: "Легенда", threshold: 10000 },
    { name: "Божество", threshold: 30000 },
    { name: "Бессмертный", threshold: 100000 },
    { name: "Космический", threshold: 5000000 }
];

const Clicker = () => {
    const { state, dispatch } = useGlobalContext();
    const [tapCount, setTapCount] = useState(0);
    const [userToken, setUserToken] = useState(null);
    const [floatingNumbers, setFloatingNumbers] = useState([]);
    const timeoutRef = useRef(null);
    const [isVibration] = useState(state.vibration);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedToken = localStorage.getItem("userToken");
        setUserToken(storedToken);

        const storedCount = localStorage.getItem("userCount");
        if (storedCount && !state.count) {
            dispatch({ type: 'UPDATE_COUNT', payload: parseInt(storedCount, 10) });
        }
    }, [dispatch]);

    const formatNumber = useMemo(() => {
        const formatter = new Intl.NumberFormat('ru-RU');
        return (number) => formatter.format(number);
    }, []);

    const syncWithServer = useCallback(async (count) => {
        if (!userToken || count === 0) return;

        try {
            const updatedCount = await incrementCount(userToken, count);
            if (typeof updatedCount === 'number') {
                dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
                localStorage.setItem("userCount", updatedCount.toString());
            }
        } catch (err) {
            console.error('Failed to sync with server:', err);
        }
        setTapCount(0);
    }, [userToken, dispatch]);

    const handleTap = useCallback((event) => {
        event.preventDefault();
        const clickMultiplier = state.multiply || 1;
        const clickPower = state.click || 1;
        const totalClickValue = clickPower * clickMultiplier;
                const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newFloatingNumber = {
            id: Date.now(),
            x,
            y,
            value: totalClickValue
        };
        
        setFloatingNumbers(prev => [...prev, newFloatingNumber]);
        
        setTimeout(() => {
            setFloatingNumbers(prev => prev.filter(num => num.id !== newFloatingNumber.id));
        }, 1000);

        if (isVibration) {
            navigator.vibrate(100);
        }

        setTapCount(prev => prev + totalClickValue);
        const newCount = (state.count || 0) + totalClickValue;
        
        dispatch({ type: 'UPDATE_COUNT', payload: newCount });

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                const updatedCount = await incrementCount(state.id, newCount);
                if (updatedCount !== null) {
                    dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
                }
            } catch (error) {
                console.error('Ошибка при обновлении счетчика:', error);
            }
        }, DEBOUNCE_DELAY);
    }, [state.id, state.count, state.click, state.multiply, isVibration, dispatch]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const displayCount = useMemo(() => (
        state.count || parseInt(localStorage.getItem("userCount"), 10) || 0
    ), [state.count]);

    const getCurrentRankInfo = useMemo(() => {
        const count = displayCount;
        let currentRank = RANKS[0];
        let nextRank = RANKS[1];

        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (count >= RANKS[i].threshold) {
                currentRank = RANKS[i];
                nextRank = RANKS[i + 1] || RANKS[i];
                break;
            }
        }

        return {
            currentRank,
            nextRank,
            progress: count,
            total: nextRank.threshold
        };
    }, [displayCount]);

    return (
        <div className="clicker-container">
            <h1 className='clicker-title'>Click Master</h1>
            <p className="counter-display">{formatNumber(displayCount)}</p>
            <p className="rank-display">Ранг: {getCurrentRankInfo.currentRank.name}</p>
            <div className="button-container" style={{ position: 'relative' }}>
                <button
                    role="button"
                    className={`button-92 ${state.multiply > 1 ? 'fire-effect' : ''}`}
                    onPointerDown={handleTap}
                >
                    Tap
                    {state.multiply > 1 && (
                        <div className="fire-particles">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="particle" />
                            ))}
                        </div>
                    )}
                </button>
                {floatingNumbers.map(number => (
                    <div
                        key={number.id}
                        className="floating-number"
                        style={{
                            left: `${number.x}px`,
                            top: `${number.y}px`,
                            position: 'absolute',
                            pointerEvents: 'none'
                        }}
                    >
                        +{number.value}
                    </div>
                ))}
            </div>
            <ProgressBar
                value={getCurrentRankInfo.progress}
                maxValue={getCurrentRankInfo.total}
                currentRank={getCurrentRankInfo.currentRank.name}
                nextRank={getCurrentRankInfo.nextRank.name}
            />
            <button className="upgrade-button" onClick={() => router.push('/UpgradePage')}>
                <GiUpgrade className="upgrade-icon" />
                <span>Upgrade</span>
            </button>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Clicker), { ssr: false });