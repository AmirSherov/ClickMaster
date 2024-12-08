'use client';

import { useState, useEffect } from 'react';
import {
    getAvailableBoosters,
    buyBooster,
} from '../api';
import { useGlobalContext } from '../GlobalState';
import './shop.scss';
import { toast, Toaster } from 'react-hot-toast';
import Nav from '../nav';
export default function ShopPage() {
    const [allBoosters, setAllBoosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const { state } = useGlobalContext();
    const userId = parseInt(state.id);

    useEffect(() => {
        loadAllBoosters();
    }, []);

    const loadAllBoosters = async () => {
        try {
            const data = await getAvailableBoosters();
            setAllBoosters(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (boosterId) => {
        try {
            await buyBooster(userId, boosterId);
            toast.success('Усилитель усп��шно куплен!');
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

    if (loading) {
        return (
            <div className="shop-page">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page">
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
                <div className="shop-header">
                    <h1>Магазин усилителей</h1>
                    <p>Покупайте новые усилители для вашего кликера</p>
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
                                        type === 'click' ? 'Усилители клика' :
                                            type === 'multiply' ? 'Множители' :
                                                type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="boosters-grid">
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
                                    <span className="price">{formatNumber(booster.basePrice) || 0} 🪙</span>
                                    <button
                                        className="buy-button"
                                        onClick={() => handleBuy(booster.id)}
                                    >
                                        Купить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Nav />
        </div>
    );
} 