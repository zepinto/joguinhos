import { useState } from 'react';
import { PlayerRole } from './Intruso';

interface IntrusoGameProps {
  players: PlayerRole[];
  onNewGame: () => void;
  onBack: () => void;
}

interface PlayerCardProps {
  player: PlayerRole;
  isRevealed: boolean;
  onToggle: (id: number) => void;
}

function PlayerCard({ player, isRevealed, onToggle }: PlayerCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'civilian':
        return '👤';
      case 'undercover':
        return '🕵️';
      case 'mrwhite':
        return '❓';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'civilian':
        return 'Civil';
      case 'undercover':
        return 'Intruso';
      case 'mrwhite':
        return 'Mr. White';
      default:
        return 'Desconhecido';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'civilian':
        return 'És um civil. A tua palavra é:';
      case 'undercover':
        return 'És um INTRUSO! A tua palavra é:';
      case 'mrwhite':
        return 'És o Mr. White! Não tens palavra. Tenta adivinhar qual é a palavra dos outros!';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={() => onToggle(player.id)}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl cursor-pointer hover:bg-white/20 transition-all active:scale-95"
      style={{
        borderColor: isRevealed ? player.color : 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Jogador {player.id}</h3>
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: player.color }}
        />
      </div>

      {!isRevealed ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-3">🎴</div>
          <div className="text-white/80">Toca para revelar</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-2">{getRoleIcon(player.role)}</div>
            <div className="text-white font-bold text-xl mb-2">
              {getRoleLabel(player.role)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-white/90 text-sm mb-3 text-center">
              {getRoleDescription(player.role)}
            </div>
            {player.role !== 'mrwhite' && (
              <div className="text-white text-2xl font-bold text-center">
                {player.word}
              </div>
            )}
          </div>

          <div className="text-white/60 text-xs text-center">
            Toca para esconder
          </div>
        </div>
      )}
    </div>
  );
}

export function IntrusoGame({ players, onNewGame, onBack }: IntrusoGameProps) {
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setRevealedPlayerId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Game Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <div className="text-white/90 text-sm text-center">
          <p className="mb-2">
            🎭 <strong>Cada jogador deve ver apenas a sua própria carta!</strong>
          </p>
          <p>
            Passem o dispositivo de jogador em jogador. Cada um revela a sua carta, memoriza, e esconde antes de passar.
          </p>
        </div>
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isRevealed={revealedPlayerId === player.id}
            onToggle={toggleCard}
          />
        ))}
      </div>

      {/* Game Stats */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <h3 className="text-white font-bold mb-3 text-center">📊 Estatísticas do Jogo</h3>
        <div className="space-y-2 text-white/90 text-sm">
          <div className="flex justify-between">
            <span>👤 Civis:</span>
            <span className="font-bold">
              {players.filter((p) => p.role === 'civilian').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>🕵️ Intrusos:</span>
            <span className="font-bold">
              {players.filter((p) => p.role === 'undercover').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>❓ Mr. White:</span>
            <span className="font-bold">
              {players.filter((p) => p.role === 'mrwhite').length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={onNewGame}
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
  );
}
