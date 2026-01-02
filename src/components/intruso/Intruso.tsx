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
  '#DC2626', // Red (darker red)
  '#0891B2', // Cyan (darker teal)
  '#CA8A04', // Yellow (darker yellow/gold)
  '#15803D', // Green (darker green)
  '#DB2777', // Pink (darker pink)
  '#7C3AED', // Purple (darker purple)
  '#EA580C', // Orange (darker orange)
  '#1D4ED8', // Blue (darker blue)
  '#BE185D', // Magenta (darker magenta)
  '#B45309', // Amber (darker amber/brown)
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
    
    // Create weighted random selection for Mr. White placement
    // Player 1 has 0% chance, players 2 to n/2 have logarithmically increasing probability
    // Players n/2+1 to n have equal probability to player n/2
    const weights: number[] = [];
    const halfPlayers = Math.max(2, Math.floor(numPlayers / 2)); // Ensure minimum of 2 to avoid division by zero
    
    for (let i = 1; i <= numPlayers; i++) {
      if (i === 1) {
        weights.push(0); // Player 1 never gets Mr. White
      } else if (i <= halfPlayers) {
        // Logarithmic growth from player 2 to n/2
        weights.push(Math.log(i) / Math.log(halfPlayers));
      } else {
        // Players after n/2 get same weight as n/2
        weights.push(1);
      }
    }
    
    // Function to select a random index based on weights
    const weightedRandomIndex = (weights: number[]): number => {
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      // Handle edge case where all weights are 0
      if (totalWeight === 0) {
        // Return a random non-zero weighted position (skip player 1)
        return Math.floor(Math.random() * (weights.length - 1)) + 1;
      }
      
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return i;
        }
      }
      return weights.length - 1;
    };
    
    // Create array of roles with initial civilians
    const roles: Array<'civilian' | 'undercover' | 'mrwhite'> = Array(numPlayers).fill('civilian');
    const assignedPositions = new Set<number>();
    
    // Assign Mr. White roles using weighted random selection
    for (let i = 0; i < mrWhite; i++) {
      let position: number;
      do {
        position = weightedRandomIndex(weights);
      } while (assignedPositions.has(position));
      
      assignedPositions.add(position);
      roles[position] = 'mrwhite';
    }
    
    // Assign undercover roles to remaining positions (standard random)
    const availablePositions = Array.from({ length: numPlayers }, (_, i) => i)
      .filter(i => !assignedPositions.has(i));
    
    for (let i = 0; i < undercover; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions.splice(randomIndex, 1)[0];
      assignedPositions.add(position);
      roles[position] = 'undercover';
    }
    
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
