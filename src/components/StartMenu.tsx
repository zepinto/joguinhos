import { useState } from 'react';
import { RulesModal } from './RulesModal';

interface StartMenuProps {
  onSelectGame: (game: 'quem-sou-eu' | 'mimica' | 'trivia' | 'intruso' | 'desenha-e-passa') => void;
}

type CSSVarStyle = React.CSSProperties & Record<string, string | number>;

const pseudo = (index: number, seed: number) => {
  const x = Math.sin(index * 999 + seed * 123.456) * 10000;
  return x - Math.floor(x);
};

export function StartMenu({ onSelectGame }: StartMenuProps) {
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'quem-sou-eu' | 'mimica' | 'trivia' | 'intruso' | 'desenha-e-passa' | null>(null);

  const games = [
    {
      id: 'quem-sou-eu' as const,
      emoji: '🎭',
      title: 'Quem Sou Eu?',
      description: 'Adivinha quem és através de perguntas',
    },
    {
      id: 'mimica' as const,
      emoji: '🎬',
      title: 'Mímica',
      description: 'Representa a palavra antes do tempo acabar',
    },
    {
      id: 'trivia' as const,
      emoji: '🎯',
      title: 'Trivia',
      description: 'Responde às perguntas de cultura geral',
    },
    {
      id: 'intruso' as const,
      emoji: '🕵️',
      title: 'Intruso',
      description: 'Descobre quem é o intruso e o Mr. White',
    },
    {
      id: 'desenha-e-passa' as const,
      emoji: '🎨',
      title: 'Desenha e Passa',
      description: 'Desenha e adivinha numa cadeia hilariante',
    },
  ];

  const snowflakes = Array.from({ length: 40 }, (_, i) => {
    const left = Math.round(pseudo(i, 1) * 100);
    const size = 4 + Math.round(pseudo(i, 2) * 6);
    const duration = 7 + pseudo(i, 3) * 8;
    const delay = -pseudo(i, 4) * duration;
    const opacity = 0.35 + pseudo(i, 5) * 0.55;
    const swayDuration = 2.4 + pseudo(i, 6) * 2.2;

    const style: CSSVarStyle = {
      '--left': `${left}%`,
      '--size': `${size}px`,
      '--duration': `${duration.toFixed(2)}s`,
      '--delay': `${delay.toFixed(2)}s`,
      '--opacity': opacity.toFixed(2),
      '--swayDuration': `${swayDuration.toFixed(2)}s`,
    };

    return { id: i, style };
  });

  const handleShowRules = (gameId: typeof games[number]['id']) => {
    setSelectedGame(gameId);
    setRulesModalOpen(true);
  };

  return (
    <div className="christmas-overlay xmas-bg min-h-screen p-4">
      <div className="snowfall" aria-hidden="true">
        {snowflakes.map((flake) => (
          <span key={flake.id} className="snowflake" style={flake.style} />
        ))}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white text-6xl mb-2">Joguinhos</h1>
          <p className="text-white/90">Escolhe um jogo para começar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((game) => (
            <div key={game.id} className="relative">
              <button
                onClick={() => onSelectGame(game.id)}
                className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl hover:bg-white/30 hover:scale-105 transition-all active:scale-95"
              >
                <div className="text-6xl mb-4">{game.emoji}</div>
                <h2 className="text-white text-2xl mb-2">{game.title}</h2>
                <p className="text-white/70">{game.description}</p>
              </button>
              <button
                onClick={() => handleShowRules(game.id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Ver regras"
              >
                ?
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {selectedGame && (
        <RulesModal
          isOpen={rulesModalOpen}
          onClose={() => setRulesModalOpen(false)}
          gameId={selectedGame}
        />
      )}
    </div>
  );
}
