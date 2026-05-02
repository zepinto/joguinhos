import { useState } from 'react';
import { LobisomemSetup } from './LobisomemSetup';
import { LobisomemGame } from './LobisomemGame';

interface LobisomemProps {
  onBack: () => void;
}

export type LobisomemRole = 'aldeão' | 'lobisomem' | 'vidente' | 'médico' | 'caçador';

export interface LobisomemPlayer {
  id: number;
  name: string;
  role: LobisomemRole;
  alive: boolean;
  color: string;
}

export interface LobisomemConfig {
  hasVidente: boolean;
  hasMedico: boolean;
  hasCacador: boolean;
}

// Calculate number of wolves based on player count
export function calculateWolves(numPlayers: number): number {
  if (numPlayers <= 7) return 1;
  if (numPlayers <= 11) return 2;
  if (numPlayers <= 15) return 3;
  return 4;
}

const playerColors = [
  '#DC2626',
  '#0891B2',
  '#CA8A04',
  '#15803D',
  '#DB2777',
  '#7C3AED',
  '#EA580C',
  '#1D4ED8',
  '#BE185D',
  '#B45309',
  '#0F766E',
  '#7C2D12',
  '#4C1D95',
  '#064E3B',
  '#1E3A5F',
  '#831843',
  '#78350F',
  '#134E4A',
  '#1E1B4B',
  '#3B0764',
];

type GameState = 'setup' | 'playing';

export function Lobisomem({ onBack }: LobisomemProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<LobisomemPlayer[]>([]);
  const [config, setConfig] = useState<LobisomemConfig>({
    hasVidente: false,
    hasMedico: false,
    hasCacador: false,
  });

  const handleStart = (
    numPlayers: number,
    playerNames: string[],
    cfg: LobisomemConfig,
  ) => {
    const numWolves = calculateWolves(numPlayers);

    // Build role list
    const roles: LobisomemRole[] = Array(numPlayers).fill('aldeão');

    // Place special roles first (they come from the aldeão pool)
    let specialCount = 0;
    const specialRoles: LobisomemRole[] = [];
    if (cfg.hasVidente) specialRoles.push('vidente');
    if (cfg.hasMedico) specialRoles.push('médico');
    if (cfg.hasCacador) specialRoles.push('caçador');

    specialCount = specialRoles.length;

    if (numWolves + specialCount > numPlayers) {
      // Fallback: reduce special roles if not enough players
      while (specialRoles.length > 0 && numWolves + specialRoles.length > numPlayers) {
        specialRoles.pop();
      }
    }

    // Shuffle assignment positions
    const positions = Array.from({ length: numPlayers }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let pos = 0;
    for (let i = 0; i < numWolves; i++) {
      roles[positions[pos++]] = 'lobisomem';
    }
    for (const sr of specialRoles) {
      roles[positions[pos++]] = sr;
    }

    const newPlayers: LobisomemPlayer[] = roles.map((role, index) => ({
      id: index + 1,
      name: playerNames[index] || `Jogador ${index + 1}`,
      role,
      alive: true,
      color: playerColors[index % playerColors.length],
    }));

    setPlayers(newPlayers);
    setConfig(cfg);
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
            <h1 className="text-white mb-2">🐺 Lobisomem</h1>
            <p className="text-white/90">Descobre quem são os lobisomens antes que seja tarde</p>
          </div>
          <LobisomemSetup onStart={handleStart} onBack={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="carnival-overlay carnival-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🐺 Lobisomem</h1>
        </div>
        <LobisomemGame
          players={players}
          config={config}
          onNewGame={handleNewGame}
          onBack={onBack}
        />
      </div>
    </div>
  );
}
