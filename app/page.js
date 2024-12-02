'use client';
import { useState, useEffect } from 'react';
import './globals.scss';
import { useRouter } from 'next/navigation';
import Clicker from './clicker';
import Nav from './nav';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /iphone|ipod|android|webos|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobile(mobile);
    if (!mobile) {
      router.push('/404');
    }
  }, [router]);


  return (
    <div className="landing-page-container">
      < Clicker/>
      <Nav/>
    </div>
  );
}

