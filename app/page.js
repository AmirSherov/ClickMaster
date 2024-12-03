'use client';
import { useState, useEffect } from 'react';
import './globals.scss';
import { useRouter } from 'next/navigation';
import Clicker from './clicker';
import Nav from './nav';
import UserInfo from './userinfo';
import { getUserDataByEmailOrId } from './api';
import { useGlobalContext } from './GlobalState';
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const {state , dispatch} = useGlobalContext();
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        router.push('/Login');
      } else {
        GetUserData(userToken);
      }
    }
  },[])
  async function GetUserData(id){
    const userData = await getUserDataByEmailOrId(null, id);
    dispatch({type: 'SET_USER_NAME', payload: userData.username});
    dispatch({type: 'SET_USER_COUNT', payload: userData.count});
    dispatch({type: 'SET_USER_DATE', payload: userData.date});
    dispatch({type: 'SET_USER_EMAIL', payload: userData.email});
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
      <UserInfo />
      <Clicker />
      <Nav />
    </div>
  );
}

