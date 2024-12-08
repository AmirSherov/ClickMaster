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
    if (window.Telegram?.WebApp) {
      setTg(window.Telegram.WebApp);
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      const result = await tg.sendData(JSON.stringify({
        action: 'connect_wallet'
      }));

      const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        setError('');
      } else {
        throw new Error('Не удалось получить адрес кошелька');
      }
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
        {!tg ? 'Откройте в Telegram' : 'Подключить кошелек'}
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