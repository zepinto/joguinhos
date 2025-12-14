interface Player {
  id: number;
  name: string;
  color: string;
}

interface PlayerCardProps {
  player: Player;
  isRevealed: boolean;
  onToggle: (id: number) => void;
}

export function PlayerCard({ player, isRevealed, onToggle }: PlayerCardProps) {
  return (
    <button
      onClick={() => onToggle(player.id)}
      className={`relative overflow-hidden rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-center border-4 border-white/30 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95`}
      style={{ backgroundColor: player.color }}
    >
      {!isRevealed ? (
        <div className="text-center">
          <div className="text-white/80 mb-2">Jogador</div>
          <div className="text-white text-6xl">{player.id}</div>
          <div className="text-white/60 mt-4 text-sm">Toca para revelar</div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-white/80 text-sm">Jogador {player.id}</div>
          <div className="text-white text-2xl px-4 break-words">{player.name}</div>
          <div className="text-white/70 text-sm mt-4 italic">
            📝 Escreve isto num post-it!
          </div>
          <div className="text-white/60 text-xs mt-2">Toca para esconder</div>
        </div>
      )}
    </button>
  );
}