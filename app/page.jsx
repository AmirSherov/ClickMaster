'use client';
import { useState, useEffect } from 'react';
import './globals.scss';
import { useRouter } from 'next/navigation';
import Clicker from './clicker';
import Nav from './nav';
import UserInfo from './userinfo';
import LoadingScreen from './LoadingScreen';
import { getUserDataByEmailOrId } from './api';
import { useGlobalContext } from './GlobalState';
function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useGlobalContext();
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        router.push('/Login');
      } else {
        GetUserData(userToken);
      }
    }
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;

    // Получение информации о пользователе
    const user = tg.initDataUnsafe.user;

    // Получение id и username
    const userId = user.id;
    const username = user.username;

    console.log('User ID:', userId);
    console.log('Username:', username);
  }, [])
  async function GetUserData(id) {
    const userData = await getUserDataByEmailOrId(null, id);
    dispatch({ type: 'SET_USER_NAME', payload: userData.username });
    dispatch({ type: 'SET_USER_COUNT', payload: userData.count });
    dispatch({ type: 'SET_USER_DATE', payload: userData.date });
    dispatch({ type: 'SET_USER_EMAIL', payload: userData.email });
    dispatch({ type: 'SET_VIBRATION', payload: userData.vibration });
    dispatch({ type: 'SET_ID', payload: userData.id });
  }
  // useEffect(() => {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   const mobile = /iphone|ipod|android|webos|blackberry|iemobile|opera mini/i.test(userAgent);
  //   setIsMobile(mobile); 
  //   if (!mobile) {
  //     router.push('/404');
  //   }
  // }, [router]);

  return (
    <div className="landing-page-container">
      <LoadingScreen />
      <UserInfo />
      <Clicker />
      <Nav />
    </div>
  );
}

export default Home