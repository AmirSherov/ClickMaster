import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../GlobalState';
import LoadingScreen from './loading';

export default function LoadingScreenPage() {
    const { state, dispatch } = useGlobalContext();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const isLoaded = localStorage.getItem('isLoaded');
        dispatch({ type: 'SET_LOADING', payload: true });

        const loadData = async () => {
            const timeout = 3000;
            const steps = 100;
            const stepDelay = timeout / steps;

            for (let i = 0; i < steps; i++) {
                await new Promise(resolve => setTimeout(resolve, stepDelay));
                setProgress(i / steps * 100);
            }

            dispatch({ type: 'SET_LOADING', payload: false });

            localStorage.setItem('isLoaded', 'true');
        };

        if (!isLoaded) {
            loadData();
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
            setProgress(100);
        }
        const handleBeforeUnload = () => {
            localStorage.removeItem('isLoaded'); 
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch]);
    if (state.loading) {
        return <LoadingScreen progress={progress} />;
    }
}