// 'use client';
// import './clicker.scss';
// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useGlobalContext } from '../GlobalState';
// import { incrementCount } from '../api';
// import ProgressBar from '../progressbar';
// import dynamic from 'next/dynamic';

// const DEBOUNCE_DELAY = 400;

// const Clicker = () => {
//     const { state, dispatch } = useGlobalContext();
//     const [tapCount, setTapCount] = useState(0);
//     const [userToken, setUserToken] = useState(null);
//     const timeoutRef = useRef(null);
//     const [isVibration] = useState(state.vibration);

//     // Инициализация состояния из localStorage
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const storedToken = localStorage.getItem("userToken");
//         setUserToken(storedToken);

//         const storedCount = localStorage.getItem("userCount");
//         if (storedCount && !state.count) {
//             dispatch({ type: 'UPDATE_COUNT', payload: parseInt(storedCount, 10) });
//         }
//     }, [dispatch]);

//     // Мемоизированная функция форматирования чисел
//     const formatNumber = useMemo(() => {
//         const formatter = new Intl.NumberFormat('ru-RU');
//         return (number) => formatter.format(number);
//     }, []);

//     // Оптимизированная функция синхронизации с сервером
//     const syncWithServer = useCallback(async (count) => {
//         if (!userToken || count === 0) return;

//         try {
//             const updatedCount = await incrementCount(userToken, count);
//             if (typeof updatedCount === 'number') {
//                 dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
//                 localStorage.setItem("userCount", updatedCount.toString());
//             }
//         } catch (err) {
//             console.error('Failed to sync with server:', err);
//         }
//         setTapCount(0);
//     }, [userToken, dispatch]);

//     // Оптимизированный обработчик нажатия
//     const handleTap = useCallback((event) => {
//         event.preventDefault();
        
//         if (isVibration) {
//             navigator.vibrate(100);
//         }

//         setTapCount(prev => prev + 1);
        
//         const newCount = (state.count || 0) + 1;
//         dispatch({ type: 'UPDATE_COUNT', payload: newCount });
//         localStorage.setItem("userCount", newCount.toString());

//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         timeoutRef.current = setTimeout(() => {
//             syncWithServer(tapCount + 1);
//         }, DEBOUNCE_DELAY);
//     }, [isVibration, state.count, tapCount, syncWithServer, dispatch]);

//     // Очистка таймера при размонтировании
//     useEffect(() => {
//         return () => {
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//             }
//         };
//     }, []);

//     const displayCount = useMemo(() => (
//         state.count || parseInt(localStorage.getItem("userCount"), 10) || 0
//     ), [state.count]);

//     return (
//         <div className="clicker-container">
//             <h1>Click Master</h1>
//             <p className="counter-display">{formatNumber(displayCount)}</p>
//             <button
//                 role="button"
//                 className="button-92"
//                 onPointerDown={handleTap}
//             >
//                 Tap
//             </button>
//             <ProgressBar value={displayCount} max={30000} />
//         </div>
//     );
// }

// export default dynamic(() => Promise.resolve(Clicker), { ssr: false });
'use client';
import './clicker.scss';
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGlobalContext } from '../GlobalState';
import { incrementCount } from '../api';
import ProgressBar from '../progressbar';
import dynamic from 'next/dynamic';

const DEBOUNCE_DELAY = 400;

// Определение рангов и их пороговых значений
const RANKS = [
    { name: "Новичок", threshold: 0 },
    { name: "Ученик", threshold: 100 },
    { name: "Адепт", threshold: 500 },
    { name: "Мастер", threshold: 2000 },
    { name: "Гранд-мастер", threshold: 5000 },
    { name: "Легенда", threshold: 10000 },
    { name: "Божество", threshold: 30000 },
    { name: "Бессмертный", threshold: 100000 }
];

const Clicker = () => {
    const { state, dispatch } = useGlobalContext();
    const [tapCount, setTapCount] = useState(0);
    const [userToken, setUserToken] = useState(null);
    const timeoutRef = useRef(null);
    const [isVibration] = useState(state.vibration);

    // Инициализация состояния из localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedToken = localStorage.getItem("userToken");
        setUserToken(storedToken);

        const storedCount = localStorage.getItem("userCount");
        if (storedCount && !state.count) {
            dispatch({ type: 'UPDATE_COUNT', payload: parseInt(storedCount, 10) });
        }
    }, [dispatch]);

    // Мемоизированная функция форматирования чисел
    const formatNumber = useMemo(() => {
        const formatter = new Intl.NumberFormat('ru-RU');
        return (number) => formatter.format(number);
    }, []);

    // Оптимизированная функция синхронизации с сервером
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

    // Оптимизированный обработчик нажатия
    const handleTap = useCallback((event) => {
        event.preventDefault();
        
        if (isVibration) {
            navigator.vibrate(100);
        }

        setTapCount(prev => prev + 1);
        
        const newCount = (state.count || 0) + 1;
        dispatch({ type: 'UPDATE_COUNT', payload: newCount });
        localStorage.setItem("userCount", newCount.toString());

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            syncWithServer(tapCount + 1);
        }, DEBOUNCE_DELAY);
    }, [isVibration, state.count, tapCount, syncWithServer, dispatch]);

    // Очистка таймера при размонтировании
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

    // Функция определения текущего ранга и следующего порога
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
            progress: count,  // Изменено: теперь передаем общее количество кликов
            total: nextRank.threshold  // Изменено: теперь передаем порог следующего ранга
        };
    }, [displayCount]);

    return (
        <div className="clicker-container">
            <h1 className='clicker-title'>Click Master</h1>
            <p className="counter-display">{formatNumber(displayCount)}</p>
            <p className="rank-display">Ранг: {getCurrentRankInfo.currentRank.name}</p>
            <button
                role="button"
                className="button-92"
                onPointerDown={handleTap}
            >
                Tap
            </button>
            <ProgressBar 
                value={getCurrentRankInfo.progress} 
                max={getCurrentRankInfo.total} 
                rankName={getCurrentRankInfo.nextRank.name}
            />
        </div>
    );
}

export default dynamic(() => Promise.resolve(Clicker), { ssr: false });