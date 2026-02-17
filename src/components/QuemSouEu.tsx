import { useEffect, useState } from 'react';
import { PlayerCard } from './PlayerCard';
import { quemSouEuCategories, categoryLabels } from './quemSouEu/categories';

const STORAGE_KEY = 'quem-sou-eu-used-names';

function loadUsedNames(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsedNames(used: Record<string, string[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(used));
  } catch {
    // Ignore storage errors
  }
}

function getUsedNamesForCategory(category: string): Set<string> {
  const allUsed = loadUsedNames();
  return new Set(allUsed[category] || []);
}

function markNamesAsUsed(category: string, names: string[]): Set<string> {
  const allUsed = loadUsedNames();
  const existing = new Set(allUsed[category] || []);
  for (const name of names) {
    existing.add(name);
  }
  allUsed[category] = Array.from(existing);
  saveUsedNames(allUsed);
  return existing;
}

function resetUsedNamesForCategory(category: string): void {
  const allUsed = loadUsedNames();
  delete allUsed[category];
  saveUsedNames(allUsed);
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

interface QuemSouEuProps {
  onBack: () => void;
}

export function QuemSouEu({ onBack }: QuemSouEuProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Array<{ id: number; name: string; color: string; revealed: boolean }>>([]);
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);
  const [numPlayers, setNumPlayers] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof quemSouEuCategories>('actoresPT');
  const [usedCount, setUsedCount] = useState(0);

  useEffect(() => {
    const used = getUsedNamesForCategory(selectedCategory);
    setUsedCount(used.size);
  }, [selectedCategory]);

  const startGame = () => {
    const categoryNames = [...quemSouEuCategories[selectedCategory]];
    const used = getUsedNamesForCategory(selectedCategory);

    let available = categoryNames.filter(name => !used.has(name));
    if (available.length < numPlayers) {
      resetUsedNamesForCategory(selectedCategory);
      available = categoryNames;
    }

    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const selectedNames = shuffled.slice(0, Math.min(numPlayers, shuffled.length));
    
    const newPlayers = selectedNames.map((name, index) => ({
      id: index + 1,
      name,
      color: playerColors[index % playerColors.length],
      revealed: false
    }));

    const updatedUsed = markNamesAsUsed(selectedCategory, selectedNames);
    setUsedCount(updatedUsed.size);

    setPlayers(newPlayers);
    setGameStarted(true);
  };

  const toggleCard = (id: number) => {
    setRevealedPlayerId(prev => prev === id ? null : id);
  };

  const newGame = () => {
    setGameStarted(false);
    setPlayers([]);
    setRevealedPlayerId(null);
  };

  const handleResetCards = () => {
    resetUsedNamesForCategory(selectedCategory);
    setUsedCount(0);
  };

  return (
    <div className="carnival-overlay carnival-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🎭 Quem sou eu?</h1>
          <p className="text-white/90">Clica em cada carta para revelar o teu nome secreto</p>
        </div>

        {!gameStarted ? (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-3">
                    Número de Jogadores
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => setNumPlayers(num)}
                        className={`py-3 px-4 rounded-xl border-2 transition-all ${
                          numPlayers === num
                            ? 'bg-white text-purple-600 border-white scale-105'
                            : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-3">
                    Categoria
                  </label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {(Object.keys(quemSouEuCategories) as Array<keyof typeof quemSouEuCategories>).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full py-3 px-4 rounded-xl border-2 transition-all text-left ${
                          selectedCategory === category
                            ? 'bg-white text-purple-600 border-white'
                            : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                        }`}
                      >
                        {categoryLabels[category]}
                        <span className="text-xs opacity-70 ml-2">
                          ({quemSouEuCategories[category].length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center space-y-2">
                  <div className="text-white/70 text-sm">
                    Cartas usadas: {usedCount} / {quemSouEuCategories[selectedCategory].length}
                  </div>
                  <button
                    onClick={handleResetCards}
                    className="w-full bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
                  >
                    Repor cartas
                  </button>
                </div>

                <button
                  onClick={startGame}
                  className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
                >
                  🎮 Iniciar Jogo
                </button>
              </div>
            </div>
            <button
              onClick={onBack}
              className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
            >
              ← Voltar ao Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isRevealed={revealedPlayerId === player.id}
                  onToggle={toggleCard}
                />
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center space-y-2">
              <div className="text-white/70 text-sm">
                Cartas usadas: {usedCount} / {quemSouEuCategories[selectedCategory].length}
              </div>
              <button
                onClick={handleResetCards}
                className="w-full bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
              >
                Repor cartas
              </button>
            </div>
            
            <button
              onClick={newGame}
              className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              🔄 Novo Jogo
            </button>
            <button
              onClick={onBack}
              className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
            >
              ← Voltar ao Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
