'use client';

import { useState, useEffect } from 'react';
import './wallet.scss';
import Nav from "../nav"

const AirdropPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tg, setTg] = useState(null);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram) {
      const webapp = window.Telegram.WebApp;
      if (webapp) {
        console.log('Telegram WebApp initialized:', webapp);
        webapp.ready();
        setTg(webapp);

        // Проверяем, есть ли уже подключенный кошелек
        if (webapp.initDataUnsafe?.user?.wallet_connected) {
          setWalletAddress(webapp.initDataUnsafe.user.wallet_address);
          setIsConnected(true);
        }
      } else {
        console.error('Telegram WebApp not found');
      }
    } else {
      console.error('Telegram object not found');
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (!tg) {
        throw new Error('Откройте приложение в Telegram');
      }

      // Отправляем команду боту для подключения кошелька
      tg.sendData(JSON.stringify({
        action: 'connect_wallet'
      }));

      // В реальном приложении адрес придет от бота после подключения
      // Здесь мы должны дождаться ответа от бота с адресом кошелька

    } catch (err) {
      setError(err.message || 'Ошибка подключения кошелька');
      console.error('Connection error:', err);
    }
  };

  const ConnectButton = () => (
    <div className="connect-wallet-section">
      <p className="wallet-description">
        Подключите кошелек для участия в Airdrop
      </p>
      <button 
        onClick={handleConnect} 
        className="wallet-button"
        disabled={!tg}
      >
        {!tg ? 'Загрузка...' : 'Подключить кошелек'}
      </button>
      {error && <p className="wallet-error">{error}</p>}
    </div>
  );

  const AirdropInfo = () => (
    <div className="airdrop-info">
      <h1 className="airdrop-title">Air Drop</h1>
      <div className="airdrop-details">
        <div className="airdrop-amount">
          <span className="amount">TOKEN</span>
          <span className="token-name">CLICK</span>
        </div>
        <p className="airdrop-description">
          Токен CLICK будет распределен между активными игроками во время Airdrop
        </p>
      </div>
      <ConnectButton />
    </div>
  );

  const WalletInfo = () => (
    isConnected && (
      <div className="wallet-info">
        <span className="wallet-label">Подключенный кошелек</span>
        <span className="wallet-address">{walletAddress}</span>
      </div>
    )
  );

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="wallet-content">
          <AirdropInfo />
          <WalletInfo />
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default AirdropPage; 