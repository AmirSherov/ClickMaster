'use client';

import { useState, useEffect } from 'react';
import {
    getAvailableBoosters,
    buyBooster,
    getUserBoosters,
    toggleBoosterEquip,
    getUserDataByEmailOrId
} from '../api';
import { useGlobalContext } from '../GlobalState';
import './inventory.scss';
import Nav from "../nav"
import { toast, Toaster } from 'react-hot-toast'
export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [allBoosters, setAllBoosters] = useState([]);
    const [userBoosters, setUserBoosters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const { state } = useGlobalContext();
    const userId = parseInt(state.id);

    useEffect(() => {
        loadAllBoosters();
    }, []);

    useEffect(() => {
        if (activeTab === 'inventory' && userId) {
            loadUserBoosters();
        }
    }, [activeTab, userId]);

    const loadAllBoosters = async () => {
        try {
            const data = await getAvailableBoosters();
            setAllBoosters(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadUserBoosters = async () => {
        if (!userId) {
            return;
        }

        try {
            const boosters = await getUserBoosters(userId);
            setUserBoosters(boosters);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (boosterId) => {
        try {
            await buyBooster(userId, boosterId);
            toast.success('Усилитель успешно куплен!');
            loadUserBoosters();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEquip = async (boosterId , type) => {
        try {
            await toggleBoosterEquip(userId, boosterId);
            loadUserBoosters();
            if (type == 'true'){
                toast.success("Успешно применен")
            } else {
                toast.success("Успешно снят")
            }
        } catch (err) {
            alert(err.message);
        }
    };
    const formatNumber = (number) => {
        if (number === undefined || number === null) return '0';
        try {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        } catch {
            return '0';
        }
    };
    const filteredBoosters = allBoosters.filter(booster => {
        if (activeTab === 'inventory' && !(booster.id in userBoosters)) {
            return false;
        }

        if (!booster) return false;

        const matchesSearch = searchQuery ? (
            (booster.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (booster.effect?.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        ) : true;

        const matchesType = selectedType === 'all' || booster.effect?.type === selectedType;

        return matchesSearch && matchesType;
    });

    const boosterTypes = ['all', ...new Set(allBoosters
        .map(b => b?.effect?.type)
        .filter(Boolean))];

    if (loading && activeTab === 'inventory') {
        return (
            <div className="inventory-page">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="inventory-page">
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        fontSize: '16px',
                        padding: '16px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                    },
                }}
            />
            <div className="container">
                <div className="inventory-header">
                    <h1>Коллекция усилителей</h1>
                    <p>Собирайте и улучшайте своего кликера</p>
                </div>

                <div className="tab-switcher">
                    <button
                        className={activeTab === 'inventory' ? 'active' : ''}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Инвентарь
                    </button>
                    <button
                        className={activeTab === 'shop' ? 'active' : ''}
                        onClick={() => setActiveTab('shop')}
                    >
                        Магазин
                    </button>
                </div>

                <div className="filters">
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Поиск усилителей..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="type-filter">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {boosterTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'Все типы' :
                                        type === 'click' ? 'Усилител�� клика' :
                                            type === 'multiply' ? 'Множители' :
                                                type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="boosters-grid">
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: '#333',
                                color: '#fff',
                                fontSize: '16px',
                                padding: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                            },
                        }}
                    />
                    {filteredBoosters.map((booster) => (
                        <div
                            key={booster.id}
                            className="booster-card"
                        >
                            <div className="image-container">
                                <img src={booster.image || '/placeholder-boost.png'} alt={booster.name || 'Буст'} />
                                <span className={`type-badge ${booster.effect?.type || ''}`}>
                                    {booster.effect?.type === 'click' ? 'Клик' :
                                        booster.effect?.type === 'multiply' ? 'Множитель' :
                                            booster.effect?.type || 'Неизвестный тип'}
                                </span>
                                {activeTab === 'inventory' && userBoosters[booster.id] && (
                                    <span className="equipped-badge">Экипирован</span>
                                )}
                            </div>

                            <div className="content">
                                <div className="header">
                                    <h2>{booster.name || 'Неизвестный буст'}</h2>
                                    <span className={`rarity ${booster.rarity || 'common'}`}>
                                        {booster.rarity === 'rare' ? 'Редкий' :
                                            booster.rarity === 'epic' ? 'Эпический' :
                                                booster.rarity === 'legendary' ? 'Легендарный' :
                                                    'Обычный'}
                                    </span>
                                </div>

                                <p className="description">
                                    {booster.effect?.description ||
                                        (booster.effect?.type === 'multiply' ?
                                            `Умножает силу клика на ${booster.effect?.value || 1}` :
                                            `Добавляет +${booster.effect?.value || 1} к силе клика`)}
                                </p>

                                <div className="footer">
                                    {activeTab === 'shop' ? (
                                        <>
                                            <span className="price">{formatNumber(booster.basePrice) || 0} 🪙</span>
                                            <button
                                                className="buy-button"
                                                onClick={() => handleBuy(booster.id)}
                                                disabled={booster.id in userBoosters}
                                            >
                                                {booster.id in userBoosters ? 'Уже куплено' : 'Купить'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="action-buttons">
                                            <button
                                                className={`buy-button ${userBoosters[booster.id] ? 'equipped' : ''}`}
                                                onClick={() => handleEquip(booster.id , userBoosters[booster.id] ? 'false' : 'true')}
                                            >
                                                {userBoosters[booster.id] ? 'Снять' : 'Экипировать'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBoosters.length === 0 && (
                    <div className="no-results">
                        <h3>Усилители не найдены</h3>
                        <p>Попробуйте изменить параметры поиска</p>
                    </div>
                )}
            </div>
            <Nav />
        </div>
    );
} 