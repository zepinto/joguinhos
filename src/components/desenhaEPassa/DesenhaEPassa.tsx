import { useState } from 'react';
import { DesenhaEPassaSetup, GameConfig } from './DesenhaEPassaSetup';
import { DesenhaEPassaGame } from './DesenhaEPassaGame';

interface DesenhaEPassaProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing';

export function DesenhaEPassa({ onBack }: DesenhaEPassaProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [config, setConfig] = useState<GameConfig | null>(null);

  const handleStart = (gameConfig: GameConfig) => {
    setConfig(gameConfig);
    setGameState('playing');
  };

  const handleNewGame = () => {
    setGameState('setup');
    setConfig(null);
  };

  if (gameState === 'setup') {
    return (
      <div className="christmas-overlay xmas-bg min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-white mb-2">🎨 Desenha e Passa</h1>
            <p className="text-white/90">Desenha e adivinha numa cadeia hilariante</p>
          </div>
          <DesenhaEPassaSetup onStart={handleStart} onBack={onBack} />
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  return (
    <div className="christmas-overlay xmas-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🎨 Desenha e Passa</h1>
        </div>
        <DesenhaEPassaGame 
          config={config} 
          onNewGame={handleNewGame} 
          onBackToMenu={onBack} 
        />
      </div>
    </div>
  );
}
