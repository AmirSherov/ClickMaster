'use client';
import { useEffect, useState, useMemo, memo, useRef } from "react";
import { getTopUsers } from "../api";
import "./rating.scss";
import { IoStar, IoTrophy, IoMedal, IoRibbon } from "react-icons/io5";
import { useGlobalContext } from "../GlobalState";
import Nav from "../nav";
import { useVirtualizer } from '@tanstack/react-virtual';

const formatNumber = new Intl.NumberFormat('ru-RU').format;

const RatingHeader = memo(() => (
    <div className="rating-text-container">
        <h1>Топ игроков <IoTrophy className="star-icon" /></h1>
        <h3>Лучшие 100 игроков по количеству кликов</h3>
    </div>
));

RatingHeader.displayName = 'RatingHeader';

const RatingInfo = memo(() => (
    <div className="rating-info">
        <div>Место</div>
        <div>Имя игрока</div>
        <div>Количество кликов</div>
    </div>
));

RatingInfo.displayName = 'RatingInfo';

const UserItem = memo(({ user, index, isCurrentUser }) => {
    const getRankIcon = (rank) => {
        switch (rank) {
            case 0:
                return <IoTrophy style={{ color: 'var(--rating-gold)' }} />;
            case 1:
                return <IoMedal style={{ color: 'var(--rating-silver)' }} />;
            case 2:
                return <IoRibbon style={{ color: 'var(--rating-bronze)' }} />;
            default:
                return null;
        }
    };

    const getRankClass = (rank) => {
        switch (rank) {
            case 0:
                return 'rank-gold';
            case 1:
                return 'rank-silver';
            case 2:
                return 'rank-bronze';
            default:
                return '';
        }
    };

    return (
        <div className={`rating-user ${isCurrentUser ? 'active' : ''}`}>
            <p className={getRankClass(index)}>
                {getRankIcon(index)}
                {index + 1}#
            </p>
            <p>{user.username}</p>
            <p>{formatNumber(user.count)}</p>
        </div>
    );
});

UserItem.displayName = 'UserItem';

export default function Rating() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state } = useGlobalContext();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const topUsers = await getTopUsers();
            setUsers(topUsers);
        } catch (err) {
            setError('Не удалось загрузить рейтинг игроков');
            console.error('Error loading users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        const interval = setInterval(loadUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="rating-wrapper error">
                <p>{error}</p>
                <button onClick={loadUsers}>Попробовать снова</button>
                <Nav />
            </div>
        );
    }

    const currentUserRank = users.findIndex(user => user.email === state.email) + 1;

    return (
        <>
            <div className="rating-wrapper">
                <div className="rating-page-container">
                    <RatingHeader />
                    
                    {currentUserRank > 0 && (
                        <div className="current-user-rank">
                            Ваше место в рейтинге: <span>#{currentUserRank}</span>
                        </div>
                    )}

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск игрока..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <RatingInfo />
                    
                    {isLoading ? (
                        <div className="loading-spinner">Загрузка рейтинга</div>
                    ) : (
                        <div className="users-container">
                            {filteredUsers.map((user, index) => (
                                <UserItem
                                    key={user.id}
                                    user={user}
                                    index={index}
                                    isCurrentUser={user.email === state.email}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredUsers.length === 0 && (
                        <div className="no-results">
                            <p>Игроки не найдены</p>
                        </div>
                    )}
                </div>
            </div>
            <Nav />
        </>
    );
}