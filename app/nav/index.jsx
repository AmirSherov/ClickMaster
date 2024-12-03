'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './nav.scss';

export default function Nav() {
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const isActive = (path) => currentPath === path;

    return (
        <nav className="bottom-navigation">
            <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Menu</Link>
            <Link href="/accaunt" className={`nav-item ${isActive('/accaunt') ? 'active' : ''}`}>Account</Link>
            <Link href="/" className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}>Tasks</Link>
            <Link href="/rating" className={`nav-item ${isActive('/rating') ? 'active' : ''}`}>Rating</Link>
        </nav>
    );
}
