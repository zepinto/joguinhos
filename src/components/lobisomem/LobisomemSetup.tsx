import { useState, useEffect } from 'react';
import { calculateWolves, LobisomemConfig } from './Lobisomem';

interface LobisomemSetupProps {
  onStart: (numPlayers: number, playerNames: string[], config: LobisomemConfig) => void;
  onBack: () => void;
}

export function LobisomemSetup({ onStart, onBack }: LobisomemSetupProps) {
  const [step, setStep] = useState<'players' | 'names'>('players');
  const [numPlayers, setNumPlayers] = useState(6);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [hasVidente, setHasVidente] = useState(false);
  const [hasMedico, setHasMedico] = useState(false);
  const [hasCacador, setHasCacador] = useState(false);

  // Load saved names from localStorage
  useEffect(() => {
    const savedNames = localStorage.getItem('lobisomem-player-names');
    if (savedNames) {
      try {
        const parsed = JSON.parse(savedNames);
        if (Array.isArray(parsed)) {
          setPlayerNames(parsed);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleContinueToNames = () => {
    const names: string[] = [];
    for (let i = 0; i < numPlayers; i++) {
      names.push(playerNames[i] || `Jogador ${i + 1}`);
    }
    setPlayerNames(names);
    setStep('names');
  };

  const handleStart = () => {
    localStorage.setItem('lobisomem-player-names', JSON.stringify(playerNames));
    onStart(numPlayers, playerNames, { hasVidente, hasMedico, hasCacador });
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const numWolves = calculateWolves(numPlayers);
  const specialCount = (hasVidente ? 1 : 0) + (hasMedico ? 1 : 0) + (hasCacador ? 1 : 0);
  const aldeoes = numPlayers - numWolves - specialCount;

  const adjustPlayers = (delta: number) => {
    setNumPlayers((prev) => Math.min(20, Math.max(6, prev + delta)));
  };

  if (step === 'names') {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-bold text-xl mb-2">👥 Nomes dos Jogadores</h3>
              <p className="text-white/80 text-sm">Introduz os nomes de cada jogador</p>
            </div>

            <div className="space-y-3">
              {Array.from({ length: numPlayers }, (_, i) => (
                <div key={i}>
                  <input
                    type="text"
                    value={playerNames[i] || ''}
                    onChange={(e) => updatePlayerName(i, e.target.value)}
                    placeholder={`Jogador ${i + 1}`}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:bg-white/30 focus:border-white/50 focus:outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
            >
              🎮 Iniciar Jogo
            </button>
          </div>
        </div>

        <button
          onClick={() => setStep('players')}
          className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
        <div className="space-y-6">
          {/* Game Rules */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3">📖 Como Jogar</h3>
            <div className="text-white/90 text-sm space-y-2">
              <p>• <strong>Lobisomens</strong> eliminam um aldeão por noite</p>
              <p>• <strong>Aldeões</strong> votam para eliminar um suspeito de dia</p>
              <p>• <strong>Vidente</strong> descobre o papel de um jogador por noite</p>
              <p>• <strong>Médico</strong> protege um jogador por noite</p>
              <p>• <strong>Caçador</strong> leva um jogador consigo quando morre</p>
            </div>
          </div>

          {/* Player Count Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Número de Jogadores
            </label>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => adjustPlayers(-1)}
                disabled={numPlayers <= 6}
                className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 text-white text-2xl font-bold hover:bg-white/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="text-white text-5xl font-bold w-16 text-center">{numPlayers}</span>
              <button
                onClick={() => adjustPlayers(1)}
                disabled={numPlayers >= 20}
                className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 text-white text-2xl font-bold hover:bg-white/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Roles */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3">✨ Papéis Especiais (Opcional)</h3>
            <div className="space-y-3">
              {[
                { label: '🔮 Vidente', desc: 'Descobre 1 identidade por noite', value: hasVidente, set: setHasVidente },
                { label: '💉 Médico', desc: 'Protege 1 jogador por noite', value: hasMedico, set: setHasMedico },
                { label: '🏹 Caçador', desc: 'Leva um jogador quando morre', value: hasCacador, set: setHasCacador },
              ].map(({ label, desc, value, set }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => set(!value)}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      value
                        ? 'bg-white border-white'
                        : 'bg-white/10 border-white/40 group-hover:border-white/60'
                    }`}
                  >
                    {value && <span className="text-purple-600 text-sm font-bold">✓</span>}
                  </div>
                  <div onClick={() => set(!value)}>
                    <div className="text-white font-medium">{label}</div>
                    <div className="text-white/60 text-xs">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Role Distribution Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3">👥 Distribuição de Papéis</h3>
            <div className="space-y-2 text-white/90">
              <div className="flex justify-between">
                <span>🐺 Lobisomens:</span>
                <span className="font-bold">{numWolves}</span>
              </div>
              {hasVidente && (
                <div className="flex justify-between">
                  <span>🔮 Vidente:</span>
                  <span className="font-bold">1</span>
                </div>
              )}
              {hasMedico && (
                <div className="flex justify-between">
                  <span>💉 Médico:</span>
                  <span className="font-bold">1</span>
                </div>
              )}
              {hasCacador && (
                <div className="flex justify-between">
                  <span>🏹 Caçador:</span>
                  <span className="font-bold">1</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>👤 Aldeões:</span>
                <span className="font-bold">{aldeoes}</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinueToNames}
            className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
          >
            Continuar →
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
