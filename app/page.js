'use client'
import { useState, useEffect } from 'react';
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /iphone|ipod|android|webos|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  return (
   <>
   <h1>
    hello world
   </h1>
   <h2>
   {isMobile ? 'Пользователь зашел с телефона' : 'Пользователь зашел с компьютера'}
   </h2>
   </>
  );
}
