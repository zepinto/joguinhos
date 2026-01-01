import { useState } from 'react';
import { IntrusoSetup } from './IntrusoSetup';
import { IntrusoGame } from './IntrusoGame';
import { wordPairs, WordPair } from './wordPairs';

interface IntrusoProps {
  onBack: () => void;
}

export interface PlayerRole {
  id: number;
  role: 'civilian' | 'undercover' | 'mrwhite';
  word: string;
  color: string;
}

// Calculate number of undercover and mr white based on player count
export function calculateRoles(numPlayers: number): { undercover: number; mrWhite: number } {
  if (numPlayers <= 3) {
    return { undercover: 1, mrWhite: 0 };
  } else if (numPlayers <= 6) {
    return { undercover: 1, mrWhite: 1 };
  } else if (numPlayers <= 8) {
    return { undercover: 2, mrWhite: 1 };
  } else {
    // 9-10 players
    return { undercover: 2, mrWhite: 2 };
  }
}

const playerColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#F38181', // Pink
  '#AA96DA', // Purple
  '#FCBAD3', // Light Pink
  '#FFFFD2', // Light Yellow
  '#A8E6CF', // Light Green
  '#FFD3B6', // Peach
];

type GameState = 'setup' | 'playing';

export function Intruso({ onBack }: IntrusoProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<PlayerRole[]>([]);

  const handleStart = (numPlayers: number) => {
    // Calculate roles
    const { undercover, mrWhite } = calculateRoles(numPlayers);
    
    // Get random word pair
    const wordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    
    // Create array of roles
    const roles: Array<'civilian' | 'undercover' | 'mrwhite'> = [];
    
    // Add civilians
    for (let i = 0; i < numPlayers - undercover - mrWhite; i++) {
      roles.push('civilian');
    }
    
    // Add undercovers
    for (let i = 0; i < undercover; i++) {
      roles.push('undercover');
    }
    
    // Add mr whites
    for (let i = 0; i < mrWhite; i++) {
      roles.push('mrwhite');
    }
    
    // Shuffle roles
    roles.sort(() => Math.random() - 0.5);
    
    // Create players with roles
    const newPlayers: PlayerRole[] = roles.map((role, index) => ({
      id: index + 1,
      role,
      word: role === 'civilian' ? wordPair.civilian : role === 'undercover' ? wordPair.undercover : 'Mr. White',
      color: playerColors[index % playerColors.length],
    }));
    
    setPlayers(newPlayers);
    setGameState('playing');
  };

  const handleNewGame = () => {
    setGameState('setup');
    setPlayers([]);
  };

  if (gameState === 'setup') {
    return (
      <div className="christmas-overlay xmas-bg min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-white mb-2">🕵️ Intruso</h1>
            <p className="text-white/90">Descobre quem é o intruso e o Mr. White</p>
          </div>
          <IntrusoSetup onStart={handleStart} onBack={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="christmas-overlay xmas-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🕵️ Intruso</h1>
        </div>
        <IntrusoGame players={players} onNewGame={handleNewGame} onBack={onBack} />
      </div>
    </div>
  );
}
