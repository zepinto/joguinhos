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
  allRevealed: boolean;
}

function PlayerCard({ player, isRevealed, onToggle, allRevealed }: PlayerCardProps) {
  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'mrwhite':
        return 'Não tens palavra. Presta atenção às pistas dos outros!';
      default:
        return 'A tua palavra é:';
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
        <h3 className="text-white font-bold text-lg">{player.name}</h3>
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: player.color }}
        />
      </div>

      {!isRevealed ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-3">🎴</div>
          <div className="text-white/80">
            {allRevealed ? 'Revelar papel' : 'Toca para revelar'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!allRevealed ? (
            // Phase 1: Show the word
            <>
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
            </>
          ) : (
            // Phase 2: Show the role
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-white/90 text-sm mb-3 text-center">
                  O teu papel é:
                </div>
                <div className="text-white text-2xl font-bold text-center">
                  {getRoleLabel(player.role)}
                </div>
              </div>

              <div className="text-white/60 text-xs text-center">
                Toca para esconder
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function IntrusoGame({ players, onNewGame, onBack }: IntrusoGameProps) {
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);
  const [revealedOnce, setRevealedOnce] = useState<Set<number>>(() => new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const toggleCard = (id: number) => {
    setRevealedPlayerId((prev) => {
      const isCurrentlyRevealed = prev === id;
      
      // If revealing a card (not hiding), mark it as revealed once
      if (!isCurrentlyRevealed && !revealedOnce.has(id)) {
        setRevealedOnce((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.add(id);
          
          // Check if all players have now revealed their cards
          if (newSet.size === players.length) {
            setAllRevealed(true);
          }
          
          return newSet;
        });
      }
      
      return isCurrentlyRevealed ? null : id;
    });
  };

  return (
    <div className="space-y-6">
      {/* Game Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <div className="text-white/90 text-sm text-center">
          <p className="mb-2">
            🎭 <strong>Cada jogador deve ver apenas a sua própria carta!</strong>
          </p>
          <p className="mb-2">
            Passem o dispositivo de jogador em jogador. Cada um revela a sua carta, memoriza, e esconde antes de passar.
          </p>
          <p className="text-white font-bold">
            ⭐ {players[0].name} começa o jogo!
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
            allRevealed={allRevealed}
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
