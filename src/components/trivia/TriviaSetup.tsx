import { useState } from 'react';
import { triviaCategories, categoryLabels } from './questions';

interface TriviaSetupProps {
  onStart: (category: keyof typeof triviaCategories, duration: number) => void;
  onBack: () => void;
}

export function TriviaSetup({ onStart, onBack }: TriviaSetupProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof triviaCategories>('ciencia');
  const [duration, setDuration] = useState(30);

  const durations = [20, 30, 45];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-white mb-3">
            Tempo (segundos)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {durations.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  duration === d
                    ? 'bg-white text-purple-600 border-white scale-105'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white mb-3">
            Categoria
          </label>
          <div className="space-y-2">
            {(Object.keys(triviaCategories) as Array<keyof typeof triviaCategories>).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full py-3 px-4 rounded-xl border-2 transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-purple-600 border-white'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(selectedCategory, duration)}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
        >
          🎯 Começar
        </button>

        <button
          onClick={onBack}
          className="w-full bg-white/10 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
        >
          ← Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
