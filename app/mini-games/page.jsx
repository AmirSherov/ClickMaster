'use client';
import Link from 'next/link';
import './games.scss';
import Nav from '../nav';
const MINI_GAMES = [
  {
    id: 'coin-catcher',
    title: 'Coin Catcher',
    description: 'Catch falling coins to earn rewards!',
    icon: './catcher.webp',
    path: 'mini-games/coin-catcher'
  }
];

export default function MiniGames() {
  return (
    <div className="mini-games-container">
      <h1>Mini Games</h1>
      <div className="games-grid">
        {MINI_GAMES.map(game => (
          <Link href={game.path} key={game.id} className="game-card">
            <div className="game-icon"><img width={160} height={160} src={game.icon} alt="" /></div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
      <h4>More games will be added soon...</h4>
      <Nav />
    </div>
  );
}