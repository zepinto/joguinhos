interface StartMenuProps {
  onSelectGame: (game: 'quem-sou-eu' | 'mimica') => void;
}

export function StartMenu({ onSelectGame }: StartMenuProps) {
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white text-6xl mb-2">🎮 Joguinhos</h1>
          <p className="text-white/90">Escolhe um jogo para começar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl hover:bg-white/30 hover:scale-105 transition-all active:scale-95"
            >
              <div className="text-6xl mb-4">{game.emoji}</div>
              <h2 className="text-white text-2xl mb-2">{game.title}</h2>
              <p className="text-white/70">{game.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
