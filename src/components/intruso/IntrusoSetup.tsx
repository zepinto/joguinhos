import { useState } from 'react';
import { calculateRoles } from './Intruso';

interface IntrusoSetupProps {
  onStart: (numPlayers: number) => void;
  onBack: () => void;
}

export function IntrusoSetup({ onStart, onBack }: IntrusoSetupProps) {
  const [numPlayers, setNumPlayers] = useState(5);

  const handleStart = () => {
    onStart(numPlayers);
  };

  const { undercover, mrWhite } = calculateRoles(numPlayers);
  const civilians = numPlayers - undercover - mrWhite;

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
        <div className="space-y-6">
          {/* Game Rules */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3">📖 Como Jogar</h3>
            <div className="text-white/90 text-sm space-y-2">
              <p>• <strong>Civis</strong> recebem a mesma palavra</p>
              <p>• <strong>Intrusos</strong> recebem uma palavra semelhante mas diferente</p>
              <p>• <strong>Mr. White</strong> não recebe palavra nenhuma</p>
              <p>• Cada jogador descreve a sua palavra sem ser óbvio</p>
              <p>• Tentem descobrir quem são os intrusos e o Mr. White!</p>
            </div>
          </div>

          {/* Player Count Selection */}
          <div>
            <label className="block text-white mb-3 font-medium">
              Número de Jogadores
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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

          {/* Role Distribution Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3">👥 Distribuição de Papéis</h3>
            <div className="space-y-2 text-white/90">
              <div className="flex justify-between">
                <span>👤 Civis:</span>
                <span className="font-bold">{civilians}</span>
              </div>
              <div className="flex justify-between">
                <span>🕵️ Intrusos:</span>
                <span className="font-bold">{undercover}</span>
              </div>
              <div className="flex justify-between">
                <span>❓ Mr. White:</span>
                <span className="font-bold">{mrWhite}</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
          >
            🎮 Iniciar Jogo
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
