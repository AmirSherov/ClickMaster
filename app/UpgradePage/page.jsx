'use client';
import "./upgrade.scss";
import Nav from "../nav";
import { FaHandPointer, FaRocket } from 'react-icons/fa';
import { useGlobalContext } from '../GlobalState';
import { useState, useEffect } from 'react';
import { updateUserFieldById } from '../api';
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { toast, Toaster } from 'react-hot-toast';

export default function UpgradePage() {
    const { state, dispatch } = useGlobalContext();
    const [currentMultiplier, setCurrentMultiplier] = useState(1);
    const [userPoints, setUserPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [boostPurchases, setBoostPurchases] = useState(3);
    const [nextResetTime, setNextResetTime] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setUserPoints(state.count || 0);
        const savedBoostData = localStorage.getItem('boostData');
        if (savedBoostData) {
            const { purchases, resetTime } = JSON.parse(savedBoostData);
            if (new Date().getTime() > resetTime) {
                setBoostPurchases(3);
                setNextResetTime(null);
                localStorage.removeItem('boostData');
            } else {
                setBoostPurchases(purchases);
                setNextResetTime(resetTime);
            }
        }
    }, [state.count]);

    const upgrades = [
        {
            id: 1,
            name: "Двойной клик",
            multiplier: 1,
            cost: 10000,
            type: "+",
            priceType: "dynamic",
            icon: <FaHandPointer className="card-icon" />,
            description: "Добавляет +1 к силе клика"
        },
        {
            id: 2,
            name: "Мега клик",
            multiplier: 5,
            cost: 12500,
            type: "X",
            priceType: "fixed",
            icon: <FaRocket className="card-icon" />,
            description: "Умножает силу клика на 5 \n работатет 15 секунд"
        }
    ];

    const formatTimeLeft = () => {
        if (!nextResetTime) return '';
        const now = new Date().getTime();
        const timeLeft = Math.max(0, nextResetTime - now);
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}ч ${minutes}м`;
    };

    const calculateCost = (upgrade) => {
        if (upgrade.priceType === "fixed") {
            return upgrade.cost;
        }
        return upgrade.cost * (state.click * 10);
    };

    const calculateNewClick = (upgrade) => {
        if (upgrade.type === "X") {
            return state.click + upgrade.multiplier;
        }
        return state.click + upgrade.multiplier;
    };

    const handleUpgrade = async (upgrade) => {
        setIsLoading(true);
        const cost = calculateCost(upgrade);

        try {
            if (userPoints >= cost) {
                if (upgrade.id === 2 && boostPurchases <= 0) {
                    toast.error('Достигнут лимит покупок буста на сегодня! Следующий сброс через: ' + formatTimeLeft());
                    setIsLoading(false);
                    return;
                }

                const newPoints = userPoints - cost;

                if (upgrade.priceType === "dynamic") {
                    const newClick = calculateNewClick(upgrade);
                    await updateUserFieldById(state.id, 'click', newClick);
                    await updateUserFieldById(state.id, 'count', newPoints);
                    
                    dispatch({ type: 'SET_CLICK', payload: newClick });
                    dispatch({ type: 'UPDATE_COUNT', payload: newPoints });
                    setUserPoints(newPoints);
                } 
                else if (upgrade.priceType === "fixed") {
                    if (upgrade.id === 2) {
                        const newPurchases = boostPurchases - 1;
                        setBoostPurchases(newPurchases);
                        if (newPurchases === 2 && !nextResetTime) {
                            const resetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                            setNextResetTime(resetTime);
                            localStorage.setItem('boostData', JSON.stringify({
                                purchases: newPurchases,
                                resetTime: resetTime
                            }));
                        } else {
                            localStorage.setItem('boostData', JSON.stringify({
                                purchases: newPurchases,
                                resetTime: nextResetTime
                            }));
                        }
                    }

                    await updateUserFieldById(state.id, 'count', newPoints);
                    dispatch({ type: 'UPDATE_COUNT', payload: newPoints });
                    dispatch({ type: 'SET_MULTIPLY', payload: upgrade.multiplier });
                    setUserPoints(newPoints);
                    if (upgrade.id === 2) {
                        setTimeout(() => {
                            router.push('/');
                        }, 300);
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('ru-RU').format(number);
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: 'black',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '16px',
                    },
                }}
            />
            <div className="upgrade-page-container">
                <h1 className="upgrade-page-title">Улучшение кликера</h1>
                <p className="upgrade-page-subtitle">
                    Текущие очки: {formatNumber(userPoints)}
                </p>
                <p className="current-multiplier">
                    Текущая сила клика: {state.click} (x{state.multiply})
                </p>

                <div className="upgrade-cards">
                    {upgrades.map((upgrade) => {
                        const cost = calculateCost(upgrade);
                        return (
                            <div key={upgrade.id} className="upgrade-card">
                                {upgrade.icon}
                                <h2>{upgrade.name}</h2>
                                <p className="multiplier">{upgrade.type}{upgrade.multiplier}</p>
                                <p className="description">{upgrade.description}</p>
                                {upgrade.id === 2 && (
                                    <p className="boost-limit">
                                        Осталось бустов: {boostPurchases}/3
                                        {nextResetTime && boostPurchases === 0 && (
                                            <span className="reset-timer">
                                                <br />Сброс через: {formatTimeLeft()}
                                            </span>
                                        )}
                                    </p>
                                )}
                                <p className="cost">Стоимость: {formatNumber(cost)}</p>
                                <button
                                    className={`upgrade-btn ${(userPoints < cost || (upgrade.id === 2 && boostPurchases <= 0)) ? 'disabled' : ''}`}
                                    onClick={() => handleUpgrade(upgrade)}
                                    disabled={userPoints < cost || (upgrade.id === 2 && boostPurchases <= 0)}
                                >
                                    {userPoints < cost ? 'Недостаточно очков' : 
                                     (upgrade.id === 2 && boostPurchases <= 0) ? 'Лимит исчерпан' : 'Улучшить'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Nav />
            {isLoading && <Loading />}
        </>
    );
}