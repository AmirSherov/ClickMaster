'use client';
import React from 'react';
import Link from 'next/link';
import './nav.scss';

export default function Nav() {
    return (
        <nav className="bottom-navigation">
            <Link href="/" className="nav-item">Menu</Link> 
            <Link href="accaunt" className="nav-item">Account</Link> 
            <Link href="/" className="nav-item">Tasks</Link> 
            <Link href="/" className="nav-item">Rating</Link> 
        </nav>
    );
}
