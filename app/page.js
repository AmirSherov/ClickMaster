'use client'
import { useState, useEffect } from 'react';
import "./globals.scss"
import { useRouter } from 'next/navigation';

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

  const [counter, setCounter] = useState(0);

  return (
    <div className='landing-page-container'>
      <h1>Click Master</h1>
      <p>Game of clicking</p>
      <p>{counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Tap</button>
    </div>
  );
}
