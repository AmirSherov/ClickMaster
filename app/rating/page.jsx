'use client';
import { useEffect, useState, useMemo, memo , useRef } from "react";
import { getTopUsers } from "../api";
import "./rating.scss";
import { IoStar } from "react-icons/io5";
import { useGlobalContext } from "../GlobalState";
import Nav from "../nav";
import { useVirtualizer } from '@tanstack/react-virtual';

const formatNumber = new Intl.NumberFormat('ru-RU').format;

const RatingHeader = memo(() => (
    <div className="rating-text-container">
        <h1>Users Rating <IoStar className="star-icon" /></h1>
        <h3>Here will be top 100 users with the most clicks</h3>
    </div>
));

RatingHeader.displayName = 'RatingHeader';

const RatingInfo = memo(() => (
    <div className="rating-info">
        <div>Rating:</div>
        <div>Balance:</div>
        <div>Username:</div>
    </div>
));

RatingInfo.displayName = 'RatingInfo';

const UserItem = memo(({ user, index, isCurrentUser }) => (
    <div className={isCurrentUser ? "rating-user active" : "rating-user"}>
        <p>{user.username}</p>
        <p>{formatNumber(user.count)}</p>
        <p>{index + 1}#</p>
    </div>
));

UserItem.displayName = 'UserItem';

export default function Rating() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state } = useGlobalContext();

    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: users.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 5,
    });

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const topUsers = await getTopUsers();
            setUsers(topUsers);
        } catch (err) {
            setError('Failed to load users ranking');
            console.error('Error loading users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        
        // Обновляем данные каждые 30 секунд
        const interval = setInterval(loadUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    const virtualItems = virtualizer.getVirtualItems();

    if (error) {
        return (
            <div className="rating-wrapper error">
                <p>{error}</p>
                <button onClick={loadUsers}>Try Again</button>
                <Nav />
            </div>
        );
    }

    return (
        <>
            <div className="rating-wrapper">
                <div className="rating-page-container">
                    <RatingHeader />
                    <RatingInfo />
                    
                    {isLoading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        <div 
                            ref={parentRef}
                            className="users-container"
                            style={{
                                height: '400px',
                                overflow: 'auto',
                            }}
                        >
                            <div
                                style={{
                                    height: `${virtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                {virtualItems.map((virtualItem) => {
                                    const user = users[virtualItem.index];
                                    return (
                                        <div
                                            key={user.id}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: `${virtualItem.size}px`,
                                                transform: `translateY(${virtualItem.start}px)`,
                                            }}
                                        >
                                            <UserItem
                                                user={user}
                                                index={virtualItem.index}
                                                isCurrentUser={user.email === state.email}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Nav />
        </>
    );
}