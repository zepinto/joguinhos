import { useState } from 'react';
import { IntrusoSetup } from './IntrusoSetup';
import { IntrusoGame } from './IntrusoGame';
import { wordPairs, WordPair } from './wordPairs';

interface IntrusoProps {
  onBack: () => void;
}

export interface PlayerRole {
  id: number;
  name: string;
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

  const handleStart = (numPlayers: number, playerNames: string[]) => {
    // Calculate roles
    const { undercover, mrWhite } = calculateRoles(numPlayers);
    
    // Get random word pair
    const wordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    
    // Get and rotate starting player
    const storedStartingPlayer = localStorage.getItem('intruso-starting-player');
    let startingPlayerIndex = storedStartingPlayer ? parseInt(storedStartingPlayer, 10) : 0;
    
    // Rotate to next player for this game
    startingPlayerIndex = (startingPlayerIndex + 1) % numPlayers;
    localStorage.setItem('intruso-starting-player', startingPlayerIndex.toString());
    
    // Create weighted random selection for Mr. White placement
    // Starting player (position 0) has 0% chance, all others have equal probability (weight 1)
    const weights: number[] = [];
    
    for (let i = 0; i < numPlayers; i++) {
      if (i === 0) {
        weights.push(0); // Starting player never gets Mr. White
      } else {
        weights.push(1); // All others have equal probability
      }
    }
    
    // Function to select a random index based on weights
    const weightedRandomIndex = (weights: number[]): number => {
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      // Handle edge case where all weights are 0
      if (totalWeight === 0) {
        // Return a random non-zero weighted position (skip position 0)
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
    
    // Reorder player names so starting player is first
    const reorderedNames: string[] = [];
    for (let i = 0; i < numPlayers; i++) {
      const originalIndex = (startingPlayerIndex + i) % numPlayers;
      reorderedNames.push(playerNames[originalIndex]);
    }
    
    // Create players with roles
    const newPlayers: PlayerRole[] = roles.map((role, index) => ({
      id: index + 1,
      name: reorderedNames[index],
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
      <div className="carnival-overlay carnival-bg min-h-screen p-4">
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
    <div className="carnival-overlay carnival-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🕵️ Intruso</h1>
        </div>
        <IntrusoGame players={players} onNewGame={handleNewGame} onBack={onBack} />
      </div>
    </div>
  );
}
