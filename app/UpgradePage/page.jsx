'use client';
import "./upgrade.scss";
import Nav from "../nav";
import { FaHandPointer, FaBolt, FaRocket } from 'react-icons/fa';
import { useGlobalContext } from '../GlobalState';
import { useState, useEffect } from 'react';
import { updateUserFieldById } from '../api';
import Loading from "../loading";
import { useRouter } from "next/navigation";
export default function UpgradePage() {
    const { state, dispatch } = useGlobalContext();
    const [currentMultiplier, setCurrentMultiplier] = useState(1);
    const [userPoints, setUserPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (typeof window === 'undefined') return;
        setUserPoints(state.count || 0);
    }, [state.count]);

    const upgrades = [
        {
            id: 1,
            name: "Двойной клик",
            multiplier: 1,
            cost: 1000,
            type: "+",
            priceType: "dynamic",
            icon: <FaHandPointer className="card-icon" />,
            description: "Добавляет +1 к силе клика"
        },
        {
            id: 2,
            name: "Мега клик",
            multiplier: 5,
            cost: 13000,
            type: "X",
            priceType: "fixed",
            icon: <FaRocket className="card-icon" />,
            description: "Умножает силу клика на 5 \n работатет 15 секунд"
        }
    ];

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
                    await updateUserFieldById(state.id, 'count', newPoints);
                    dispatch({ type: 'UPDATE_COUNT', payload: newPoints });
                    dispatch({ type: 'SET_MULTIPLY', payload: upgrade.multiplier });
                    setUserPoints(newPoints);
                    setIsLoading(false);
                    setTimeout(() => {
                        router.push('/');
                    },300)
                }
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
        }
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('ru-RU').format(number);
    };

    return (
        <>
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
                                <p className="cost">Стоимость: {formatNumber(cost)}</p>
                                <button
                                    className={`upgrade-btn ${userPoints < cost ? 'disabled' : ''}`}
                                    onClick={() => handleUpgrade(upgrade)}
                                    disabled={userPoints < cost}
                                >
                                    {userPoints < cost ? 'Недостаточно очков' : 'Улучшить'}
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