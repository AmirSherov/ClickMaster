// 'use client';
// import './clicker.scss';
// import React, { useState, useEffect, useRef } from "react";
// import { useGlobalContext } from '../GlobalState';
// import { incrementCount } from '../api';

// export default function Clicker() {
//     const { state, dispatch } = useGlobalContext();
//     const [tapCount, setTapCount] = useState(0);
//     const [userToken, setUserToken] = useState(null);
//     const timeoutRef = useRef(null);

//     // Загружаем данные из localStorage при монтировании компонента
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedToken = localStorage.getItem("userToken");
//             const storedCount = localStorage.getItem("userCount");

//             setUserToken(storedToken);

//             if (storedCount) {
//                 // Если count найден в localStorage, синхронизируем с глобальным состоянием
//                 dispatch({ type: 'UPDATE_COUNT', payload: parseInt(storedCount, 10) });
//             }
//         }
//     }, [dispatch]);

//     // Обработчик кликов
//     const handleTap = (event) => {
//         event.preventDefault();

//         // Увеличиваем счетчик кликов
//         const newTapCount = tapCount + 1;
//         setTapCount(newTapCount);

//         // Обновляем количество кликов в localStorage
//         const updatedCount = (state.count || 0) + 1;
//         localStorage.setItem("userCount", updatedCount);

//         // Очищаем старый таймер, если он существует
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         // Создаем новый таймер для отправки данных на сервер через 2 секунды
//         timeoutRef.current = setTimeout(() => {
//             if (userToken && newTapCount > 0) {
//                 incrementCount(userToken, newTapCount)
//                     .then((updatedCount) => {
//                         if (typeof updatedCount === 'number') {
//                             // Обновляем счетчик в глобальном состоянии и localStorage
//                             dispatch({ type: 'UPDATE_COUNT', payload: updatedCount });
//                             localStorage.setItem("userCount", updatedCount);
//                         }
//                     })
//                     .catch((err) => console.error('API error:', err))
//                     .finally(() => setTapCount(0)); // Сбрасываем локальный счетчик после отправки
//             }
//         }, 2000);
//     };

//     // Очистка таймера при размонтировании компонента
//     useEffect(() => {
//         return () => {
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//             }
//         };
//     }, []);

//     // Отображаем количество кликов из global state или localStorage
//     const displayCount = state.count || parseInt(localStorage.getItem("userCount"), 10) || 0;

//     return (
//         <div className="clicker-container">
//             <h1>Click Master</h1>
//             <p className="counter-display">{displayCount}</p>
//             <button
//                 role="button"
//                 className="button-92"
//                 onPointerDown={handleTap}
//             >
//                 Tap
//             </button>
//         </div>
//     );
// }
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
        }, 2000);
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
