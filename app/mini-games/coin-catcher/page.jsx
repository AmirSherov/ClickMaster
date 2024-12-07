'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './catcher.scss';
import { incrementCount } from '@/app/api';
import { useGlobalContext } from '@/app/GlobalState';
import { toast, Toaster } from 'react-hot-toast';
import { IoIosArrowBack } from "react-icons/io";
export default function CoinCatcher() {
    const [gameState, setGameState] = useState('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [coins, setCoins] = useState([]);
    const [speed, setSpeed] = useState(1);
    const gameAreaRef = useRef(null);
    const { state, dispatch } = useGlobalContext();
    const router = useRouter();
    const audio = useRef(null);
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

    const collectCoin = (coinId, event) => {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.play();
        const coin = event.target;
        const rect = coin.getBoundingClientRect();
        const clickX = event.clientX;
        const clickY = event.clientY;
        
        const padding = 20; 
        
        if (
          clickX >= rect.left - padding &&
          clickX <= rect.right + padding &&
          clickY >= rect.top - padding &&
          clickY <= rect.bottom + padding
        ) {
          setCoins(prev => prev.filter(coin => coin.id !== coinId));
          setScore(prev => prev + 150);
          navigator.vibrate(50);
        }
      };

    const claimRewards = () => {
        dispatch({ type: 'UPDATE_COUNT', payload: state.count + score });
        incrementCount(state.id, state.count + score);
        toast.success('Rewards claimed successfully!');
        setTimeout(() => {
            router.push('/mini-games');
        }, 1100);
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
                    setSpeed(prev => prev * 1.30);
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
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        fontSize: '16px',
                        padding: '16px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                    },
                }}
            />
            <audio ref={audio} src="/coin.wav" preload="auto"></audio>
            <div className="game-header">
            <div onClick={() => router.push('/mini-games')} style={{color: '#fff', fontSize: '30px'}} className="rank"><IoIosArrowBack /></div>
                <div className="score">Score: {score} <img width={30} style={{ transform: 'translateY(3px)' }} height={30} src={"/coin.png"} alt="" /></div>
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
                        style={{
                            left: `${coin.x}px`,
                            top: `${coin.y}px`,
                            transform: `scale(${speed > 2 ? 1.2 : 1})`
                        }}
                        onClick={(e) => collectCoin(coin.id, e)}
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