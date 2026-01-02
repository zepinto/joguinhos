import { useState } from 'react';

interface GameSetupProps {
  onStart: (numPlayers: number, category: string) => void;
  categories: string[];
}

export function GameSetup({ onStart, categories }: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState('celebridades');

  const handleStart = () => {
    onStart(numPlayers, selectedCategory);
  };

  return (
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
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full py-3 px-4 rounded-xl border-2 transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-white text-purple-600 border-white'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
        >
          🎮 Iniciar Jogo
        </button>
      </div>
    </div>
  );
}
