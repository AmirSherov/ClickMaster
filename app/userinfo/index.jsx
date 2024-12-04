'use client';
import './userinfo.scss';
import { memo, useMemo } from 'react';
import { MdAccountCircle } from "react-icons/md";
import { useGlobalContext } from '../GlobalState';

const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const UserInfoButton = memo(({ userName }) => (
    <button className="user-info-button">
        <span className="user-name">{userName}</span>
        <MdAccountCircle className="user-icon" aria-hidden="true" />
    </button>
));

UserInfoButton.displayName = 'UserInfoButton';

export default function UserInfo() {
    const { state } = useGlobalContext();

    const formattedName = useMemo(() => 
        capitalizeWords(state.userName || 'Guest'),
        [state.userName]
    );

    return (
        <div className="user-info-container">
            <UserInfoButton userName={formattedName} />
        </div>
    );
}