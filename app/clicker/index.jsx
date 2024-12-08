'use client';
import './clicker.scss';
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGlobalContext } from '../GlobalState';
import { incrementCount, getAvailableBoosters, getUserDataByEmailOrId } from '../api';
import ProgressBar from '../progressbar';
import dynamic from 'next/dynamic';
import { GiUpgrade } from "react-icons/gi";
import { useRouter } from 'next/navigation';
import { BsBackpack2Fill } from "react-icons/bs";
import { MdOutlineInventory2 } from "react-icons/md";
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

const EquippedBoosts = ({ equippedBoosts = [] }) => {
    return (
        <div className="boost-slots">
            {[0, 1, 2].map((slotIndex) => {
                const boost = equippedBoosts[slotIndex];
                return (
                    <div 
                        key={slotIndex} 
                        className={`boost-slot ${boost ? 'occupied' : ''}`}
                    >
                        {boost ? (
                            <div className="active-boost" title={boost.name}>
                                <img src={boost.image} alt={boost.name} />
                                {boost.effect?.type === 'multiply' ? (
                                    <div className="boost-value">x{boost.effect.value}</div>
                                ) : (
                                    <div className="boost-value">+{boost.effect.value}</div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-slot">
                                <MdOutlineInventory2 />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const Clicker = () => {
    const { state, dispatch } = useGlobalContext();
    const [equippedBoosts, setEquippedBoosts] = useState([]);
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

    useEffect(() => {
        const loadEquippedBoosts = async () => {
            try {
                if (!state.id) return;
                
                const allBoosts = await getAvailableBoosters();
                const boostsMap = {};
                allBoosts.forEach(boost => {
                    boostsMap[boost.id] = boost;
                });
                const userData = await getUserDataByEmailOrId(null, state.id);
                const userBoosters = userData?.userBoosters || {};

                const equippedBoostsArray = Object.entries(userBoosters)
                    .filter(([_, isEquipped]) => isEquipped)
                    .map(([boostId]) => boostsMap[boostId])
                    .filter(Boolean);

                console.log('Экипированные бусты:', equippedBoostsArray);
                setEquippedBoosts(equippedBoostsArray);
            } catch (error) {
                console.error('Ошибка при загрузке бустов:', error);
                setEquippedBoosts([]);
            }
        };

        loadEquippedBoosts();
    }, [state.id]);

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

    const handleBoostDrop = async (boostData, slotIndex) => {
        try {
            console.log('Received boost data:', boostData);
            
            await toggleBoosterEquip(state.id, boostData.id, slotIndex);


            const newActiveBoosts = [...equippedBoosts];
            newActiveBoosts[slotIndex] = boostData; 
            setEquippedBoosts(newActiveBoosts);
            localStorage.setItem('activeBoosts', JSON.stringify(newActiveBoosts));
            
            console.log('Current state:', {
                baseClick: state.click,
                baseMultiply: state.multiply,
                activeBoosts: newActiveBoosts
            });

            const baseClick = Number(state.click) || 1;
            let finalClick = baseClick;
            let finalMultiply = 1;

            newActiveBoosts.forEach(boost => {
                if (boost) {
                    console.log('Processing boost:', boost);
                    if (boost.type === 'click') {
                        finalClick += Number(boost.value || 0);
                        console.log('Added click power:', boost.value, 'New total:', finalClick);
                    } else if (boost.type === 'multiply') {
                        finalMultiply *= Number(boost.value || 1);
                        console.log('Applied multiplier:', boost.value, 'New total:', finalMultiply);
                    }
                }
            });

            console.log('Final values:', {
                baseClick,
                finalClick,
                finalMultiply
            });

            dispatch({ type: 'SET_CLICK', payload: finalClick });
            dispatch({ type: 'SET_MULTIPLY', payload: finalMultiply });

        } catch (error) {
            console.error('Ошибка при экипировке буста:', error);
            alert('Не удалось экипировать буст');
        }
    };

    const removeBoost = async (slotIndex) => {
        try {
            const boostToRemove = equippedBoosts[slotIndex];
            if (!boostToRemove) return;

            await toggleBoosterEquip(state.id, boostToRemove.id);

            const newActiveBoosts = [...equippedBoosts];
            newActiveBoosts[slotIndex] = null;
            setEquippedBoosts(newActiveBoosts);
            localStorage.setItem('activeBoosts', JSON.stringify(newActiveBoosts));
            
            let totalMultiplier = 1;
            let additionalClickPower = 0;
            
            newActiveBoosts.forEach(boost => {
                if (boost) {
                    if (boost.type === 'multiply') {
                        const boostValue = Number(boost.effect?.value || 1);
                        totalMultiplier *= boostValue;
                    } else if (boost.type === 'click') {
                        const boostValue = Number(boost.effect?.value || 0);
                        additionalClickPower += boostValue;
                    }
                }
            });
            
            dispatch({ type: 'SET_MULTIPLY', payload: totalMultiplier });
            
            const baseClickPower = state.click || 1;
            const newClickPower = baseClickPower + additionalClickPower;
            dispatch({ type: 'SET_CLICK', payload: newClickPower });

            console.log('After removing boost:', {
                baseClickPower,
                additionalClickPower,
                newClickPower,
                totalMultiplier
            });
        } catch (error) {
            console.error('Ошибка при снятии буста:', error);
            alert('Не удалось снять буст');
        }
    };

    const handleTap = useCallback((event) => {
        event.preventDefault();
        
        let finalClick = Number(state.click || 1);
        let finalMultiply = Number(state.multiply || 1);
        let criticalChance = 0;
        

        equippedBoosts.forEach(boost => {
            if (boost && boost.effect) {
                if (boost.effect.type === 'click' || boost.effect.type === 'add') {
                    finalClick += Number(boost.effect.value || 0);
                } else if (boost.effect.type === 'multiply') {
                    finalMultiply *= Number(boost.effect.value || 1);
                } else if (boost.effect.type === 'critical') {
                    criticalChance += Number(boost.effect.value || 0);
                }
            }
        });

        let isCritical = false;
        if (criticalChance > 0) {
            isCritical = Math.random() * 100 < criticalChance;
        }

        let totalClickValue = Math.floor(finalClick * finalMultiply);
        if (isCritical) {
            totalClickValue *= 2;
        }
        
        console.log('Click calculation:', {
            baseClick: state.click,
            finalClick,
            finalMultiply,
            criticalChance,
            isCritical,
            totalClickValue,
            equippedBoosts
        });

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newFloatingNumber = {
            id: Date.now(),
            x,
            y,
            value: totalClickValue,
            isCritical
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
    }, [state.id, state.count, state.click, state.multiply, isVibration, dispatch, equippedBoosts]);

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
            <EquippedBoosts equippedBoosts={equippedBoosts} />
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
                        className={`click-floating-number ${number.isCritical ? 'critical' : ''}`}
                        style={{
                            left: `${number.x}px`,
                            top: `${number.y}px`
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
        </div>
    );
};

export default dynamic(() => Promise.resolve(Clicker), { ssr: false });