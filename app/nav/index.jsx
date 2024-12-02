'use client';
import React from 'react';
import Link from 'next/link';
import './nav.scss';

export default function Nav() {
    return (
        <nav className="bottom-navigation">
            <Link href="/" className="nav-item">Menu</Link> 
            <Link href="/" className="nav-item">Account</Link> 
            <Link href="/" className="nav-item">Tasks</Link> 
        </nav>
    );
}
