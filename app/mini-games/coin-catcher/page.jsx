'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './catcher.scss';
import { incrementCount } from '@/app/api';
import { useGlobalContext } from '@/app/GlobalState';
export default function CoinCatcher() {
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coins, setCoins] = useState([]);
  const [speed, setSpeed] = useState(1);
  const gameAreaRef = useRef(null);
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setSpeed(1);
    setCoins([]);
  };

  const spawnCoin = () => {
    if (!gameAreaRef.current) return;
    const newCoin = {
      id: Date.now(),
      x: Math.random() * (gameAreaRef.current.clientWidth - 65), 
      y: -60
    };
    setCoins(prev => [...prev, newCoin]);
  };

  const collectCoin = (coinId) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
    setScore(prev => prev + 100);
  };

  const claimRewards = () => {
    dispatch({ type: 'UPDATE_COUNT', payload: state.count + score });
    incrementCount(state.id, state.count + score);
    router.push('/mini-games');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setCoins(prev => {
        const newCoins = prev.map(coin => ({
          ...coin,
          y: coin.y + (3 * speed)
        }));
        return newCoins.filter(coin => coin.y < window.innerHeight);
      });
    }, 16);

    const coinSpawner = setInterval(spawnCoin, 1000 / speed);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameState('finished');
          return 0;
        }
        if (prev % 5 === 0 && prev !== 30) {
          setSpeed(prev => prev * 1.1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameLoop);
      clearInterval(coinSpawner);
      clearInterval(timer);
    };
  }, [gameState, speed]);

  return (
    <div className="coin-catcher">
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      <div className="game-area" ref={gameAreaRef}>
        {gameState === 'ready' && (
          <button className="start-button" onClick={startGame}>
            Play
          </button>
        )}

        {gameState === 'playing' && coins.map(coin => (
          <div
            key={coin.id}
            className="coin"
            style={{ left: `${coin.x}px`, top: `${coin.y}px` }}
            onClick={() => collectCoin(coin.id)}
          />
        ))}

        {gameState === 'finished' && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>You collected: {score} coins</p>
            <button className="claim-button" onClick={claimRewards}>
              Claim Rewards
            </button>
          </div>
        )}
      </div>
    </div>
  );
}