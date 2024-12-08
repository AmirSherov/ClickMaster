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
    try {
      // Инициализируем Telegram WebApp
      const webapp = window.Telegram?.WebApp;
      if (webapp) {
        webapp.ready();
        webapp.expand();
        setTg(webapp);
      }
    } catch (err) {
      console.error('Ошибка инициализации Telegram WebApp:', err);
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (!tg) {
        throw new Error('Откройте приложение в Telegram');
      }

      // Показываем попап подтверждения
      tg.showPopup({
        title: 'Подключение кошелька',
        message: 'Подтвердите подключение кошелька',
        buttons: [
          { text: 'Подключить', type: 'ok' },
          { text: 'Отмена', type: 'cancel' }
        ]
      }, (buttonId) => {
        if (buttonId === 'ok') {
          // После подтверждения отправляем запрос боту
          tg.sendData(JSON.stringify({
            action: 'connect_wallet'
          }));
          
          // В реальном приложении здесь нужно дождаться ответа от бота
          // с адресом кошелька, а пока используем тестовый адрес
          const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
          setWalletAddress(address);
          setIsConnected(true);
          setError('');
        }
      });
    } catch (err) {
      setError(err.message || 'Ошибка подключения кошелька');
      console.error('Ошибка:', err);
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
        <span className="wallet-label">Кошелек</span>
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