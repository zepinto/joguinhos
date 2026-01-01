import { useState } from 'react';
import { desenhaEPassaCategories, categoryLabels } from './words';

interface DesenhaEPassaSetupProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

export interface GameConfig {
  numPlayers: number;
  playerNames: string[];
  category: keyof typeof desenhaEPassaCategories;
  drawingTime: number;
  guessingTime: number;
}

export function DesenhaEPassaSetup({ onStart, onBack }: DesenhaEPassaSetupProps) {
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: 4 }, (_, i) => `Jogador ${i + 1}`)
  );
  const [category, setCategory] = useState<keyof typeof desenhaEPassaCategories>('animais');
  const [drawingTime, setDrawingTime] = useState(45);
  const [guessingTime, setGuessingTime] = useState(20);
  const [step, setStep] = useState<'players' | 'names' | 'settings'>('players');

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num);
    setPlayerNames(
      Array.from({ length: num }, (_, i) => 
        playerNames[i] || `Jogador ${i + 1}`
      )
    );
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    onStart({
      numPlayers,
      playerNames,
      category,
      drawingTime,
      guessingTime,
    });
  };

  if (step === 'players') {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
          <div className="space-y-6">
            {/* Game Rules */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
              <h3 className="text-white font-bold mb-3">📖 Como Jogar</h3>
              <div className="text-white/90 text-sm space-y-2">
                <p>• Cada jogador começa com uma palavra aleatória</p>
                <p>• Alterna entre desenhar e adivinhar o que vês</p>
                <p>• O telemóvel passa de jogador em jogador</p>
                <p>• No final, vê como a palavra evoluiu!</p>
                <p>• Ganham pontos se a cadeia acertar a palavra original</p>
              </div>
            </div>

            {/* Player Count Selection */}
            <div>
              <label className="block text-white mb-3 font-medium">
                Número de Jogadores (4-10)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumPlayersChange(num)}
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

            {/* Next Button */}
            <button
              onClick={() => setStep('names')}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
            >
              Próximo →
            </button>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
        >
          ← Voltar ao Menu
        </button>
      </div>
    );
  }

  if (step === 'names') {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl mb-4">👥 Nomes dos Jogadores</h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {playerNames.map((name, index) => (
                <div key={index}>
                  <label className="block text-white/80 text-sm mb-1">
                    Jogador {index + 1}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder={`Jogador ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep('players')}
                className="bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setStep('settings')}
                className="bg-white text-purple-600 py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // step === 'settings'
  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
        <div className="space-y-6">
          <h3 className="text-white font-bold text-xl mb-4">⚙️ Configurações</h3>

          {/* Category Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Categoria
            </label>
            <div className="space-y-2">
              {(Object.keys(desenhaEPassaCategories) as Array<keyof typeof desenhaEPassaCategories>).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full py-3 px-4 rounded-xl border-2 transition-all text-left ${
                    category === cat
                      ? 'bg-white text-purple-600 border-white'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Drawing Time Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Tempo para Desenhar
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setDrawingTime(time)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    drawingTime === time
                      ? 'bg-white text-purple-600 border-white scale-105'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Guessing Time Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Tempo para Adivinhar
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[15, 20, 30].map((time) => (
                <button
                  key={time}
                  onClick={() => setGuessingTime(time)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    guessingTime === time
                      ? 'bg-white text-purple-600 border-white scale-105'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStep('names')}
              className="bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              ← Voltar
            </button>
            <button
              onClick={handleStart}
              className="bg-white text-purple-600 py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
            >
              🎨 Começar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
