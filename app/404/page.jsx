'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './404.scss';

export default function NotFound() {
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /iphone|ipod|android|webos|blackberry|iemobile|opera mini/i.test(userAgent);
        if (isMobileDevice) {
            router.push('/');
        } else {
            setIsMobile(false); 
        }
    }, []); 
    if (isMobile) return null;

    return (
        <div className="container404">
            <h1 className="title404">404 - Unsupported Platform</h1>
            <p className="message404">
                К сожалению, игра <span className="gameName404">Клик Мастер</span> не поддерживается на версиях для настольных компьютеров.
            </p>
            <p className="message404">Пожалуйста, откройте игру на смартфоне, чтобы продолжить.</p>
            <img width={200} src="/404qr.png" alt="QR Code" />
        </div>
    );
}
