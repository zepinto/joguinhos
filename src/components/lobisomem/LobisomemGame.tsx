import { useState } from 'react';
import { LobisomemPlayer, LobisomemConfig, LobisomemRole } from './Lobisomem';

interface LobisomemGameProps {
  players: LobisomemPlayer[];
  config: LobisomemConfig;
  onNewGame: () => void;
  onBack: () => void;
}

type GamePhase =
  | 'distribution'
  | 'night-start'
  | 'night-wolves'
  | 'night-vidente'
  | 'night-vidente-result'
  | 'night-medico'
  | 'day-reveal'
  | 'day-hunter'
  | 'day-vote'
  | 'day-eliminated'
  | 'finished';

const roleLabel: Record<LobisomemRole, string> = {
  aldeão: 'Aldeão',
  lobisomem: 'Lobisomem',
  vidente: 'Vidente',
  médico: 'Médico',
  caçador: 'Caçador',
};

const roleEmoji: Record<LobisomemRole, string> = {
  aldeão: '👤',
  lobisomem: '🐺',
  vidente: '🔮',
  médico: '💉',
  caçador: '🏹',
};

// ---- Distribution Phase ----

interface DistributionCardProps {
  player: LobisomemPlayer;
  isRevealed: boolean;
  onToggle: (id: number) => void;
  allRevealed: boolean;
}

function DistributionCard({
  player,
  isRevealed,
  onToggle,
  allRevealed,
}: DistributionCardProps) {
  return (
    <div
      onClick={() => onToggle(player.id)}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl cursor-pointer hover:bg-white/20 transition-all active:scale-95"
      style={{ borderColor: isRevealed ? player.color : 'rgba(255,255,255,0.3)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">{player.name}</h3>
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: player.color }} />
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
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-white/90 text-sm mb-3 text-center">O teu papel é:</div>
            <div className="text-white text-3xl text-center mb-1">
              {roleEmoji[player.role]}
            </div>
            <div className="text-white text-2xl font-bold text-center">
              {roleLabel[player.role]}
            </div>
          </div>
          <div className="text-white/60 text-xs text-center">Toca para esconder</div>
        </div>
      )}
    </div>
  );
}

// ---- Player Selector ----

interface PlayerSelectorProps {
  players: LobisomemPlayer[];
  selected: number | null;
  onSelect: (id: number) => void;
  excludeIds?: number[];
  label: string;
}

function PlayerSelector({ players, selected, onSelect, excludeIds = [], label }: PlayerSelectorProps) {
  const available = players.filter((p) => p.alive && !excludeIds.includes(p.id));
  return (
    <div className="space-y-2">
      <p className="text-white/80 text-sm text-center">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {available.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`py-3 px-4 rounded-xl border-2 transition-all text-left ${
              selected === p.id
                ? 'bg-white text-purple-700 border-white font-bold scale-105'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: p.color }}
            />
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Main Game Component ----

export function LobisomemGame({ players: initialPlayers, config, onNewGame, onBack }: LobisomemGameProps) {
  // Distribution state
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);
  const [revealedOnce, setRevealedOnce] = useState<Set<number>>(() => new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  // Game state
  const [phase, setPhase] = useState<GamePhase>('distribution');
  const [alivePlayers, setAlivePlayers] = useState<LobisomemPlayer[]>(initialPlayers);
  const [round, setRound] = useState(1);

  // Night selections
  const [wolfVictim, setWolfVictim] = useState<number | null>(null);
  const [medicoProtect, setMedicoProtect] = useState<number | null>(null);
  const [videnteTarget, setVidenteTarget] = useState<number | null>(null);

  // Day state
  const [nightDeaths, setNightDeaths] = useState<LobisomemPlayer[]>([]);
  const [voteEliminated, setVoteEliminated] = useState<number | null>(null);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<LobisomemPlayer | null>(null);
  const [hunterTarget, setHunterTarget] = useState<number | null>(null);
  const [hunterPlayer, setHunterPlayer] = useState<LobisomemPlayer | null>(null);
  const [winner, setWinner] = useState<'lobisomens' | 'aldeões' | null>(null);

  // All players for final reveal
  const [allPlayers] = useState<LobisomemPlayer[]>(initialPlayers);

  // ----- Distribution phase -----

  const toggleCard = (id: number) => {
    setRevealedPlayerId((prev) => {
      if (prev === id) {
        setRevealedOnce((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.add(id);
          if (newSet.size === initialPlayers.length) {
            setAllRevealed(true);
          }
          return newSet;
        });
        return null;
      }
      return id;
    });
  };

  // ----- Win condition -----

  const checkWinner = (players: LobisomemPlayer[]): 'lobisomens' | 'aldeões' | null => {
    const livingWolves = players.filter((p) => p.alive && p.role === 'lobisomem').length;
    const livingOthers = players.filter((p) => p.alive && p.role !== 'lobisomem').length;
    if (livingWolves === 0) return 'aldeões';
    if (livingWolves >= livingOthers) return 'lobisomens';
    return null;
  };

  const eliminatePlayer = (players: LobisomemPlayer[], id: number): LobisomemPlayer[] =>
    players.map((p) => (p.id === id ? { ...p, alive: false } : p));

  // ----- Night phase handlers -----

  const confirmWolfVictim = () => {
    if (!wolfVictim) return;
    // Determine next night phase
    if (config.hasVidente && alivePlayers.some((p) => p.alive && p.role === 'vidente')) {
      setPhase('night-vidente');
    } else if (config.hasMedico && alivePlayers.some((p) => p.alive && p.role === 'médico')) {
      setPhase('night-medico');
    } else {
      resolveNight();
    }
  };

  const confirmVidenteTarget = () => {
    if (!videnteTarget) return;
    setPhase('night-vidente-result');
  };

  const continueAfterVidente = () => {
    if (config.hasMedico && alivePlayers.some((p) => p.alive && p.role === 'médico')) {
      setPhase('night-medico');
    } else {
      resolveNight();
    }
  };

  const confirmMedicoProtect = () => {
    if (!medicoProtect) return;
    resolveNight();
  };

  const resolveNight = () => {
    const deaths: LobisomemPlayer[] = [];
    let updatedPlayers = [...alivePlayers];

    if (wolfVictim !== null) {
      const saved = medicoProtect !== null && medicoProtect === wolfVictim;
      if (!saved) {
        const victim = alivePlayers.find((p) => p.id === wolfVictim)!;
        deaths.push(victim);
        updatedPlayers = eliminatePlayer(updatedPlayers, wolfVictim);
      }
    }

    setNightDeaths(deaths);
    setAlivePlayers(updatedPlayers);

    // Reset night selections
    setWolfVictim(null);
    setVidenteTarget(null);
    setMedicoProtect(null);

    // Check if hunter died
    const hunterDied = deaths.find((p) => p.role === 'caçador');
    if (hunterDied && config.hasCacador) {
      setHunterPlayer(hunterDied);
      // Temporarily advance to day-reveal, but flag hunter
    }

    setPhase('day-reveal');
  };

  const confirmDayReveal = () => {
    // If hunter died at night, let them choose
    if (hunterPlayer) {
      setPhase('day-hunter');
    } else {
      setPhase('day-vote');
    }
  };

  const confirmHunterTarget = () => {
    if (!hunterTarget) return;
    let updated = eliminatePlayer(alivePlayers, hunterTarget);
    setAlivePlayers(updated);

    const w = checkWinner(updated);
    if (w) {
      setWinner(w);
      setPhase('finished');
      return;
    }

    setHunterPlayer(null);
    setHunterTarget(null);
    setPhase('day-vote');
  };

  const confirmVote = () => {
    if (!voteEliminated) return;
    const eliminated = alivePlayers.find((p) => p.id === voteEliminated)!;
    setEliminatedPlayer(eliminated);
    const updated = eliminatePlayer(alivePlayers, voteEliminated);
    setAlivePlayers(updated);
    setVoteEliminated(null);
    setPhase('day-eliminated');
  };

  const continueAfterEliminated = () => {
    if (!eliminatedPlayer) return;

    // Check if the eliminated player was the hunter
    if (eliminatedPlayer.role === 'caçador' && config.hasCacador) {
      setHunterPlayer(eliminatedPlayer);
      setPhase('day-hunter');
      return;
    }

    const w = checkWinner(alivePlayers);
    if (w) {
      setWinner(w);
      setPhase('finished');
      return;
    }

    // Next round
    setRound((r) => r + 1);
    setEliminatedPlayer(null);
    setNightDeaths([]);
    setHunterPlayer(null);
    setHunterTarget(null);
    setPhase('night-start');
  };

  // ---- RENDER ----

  // Distribution phase
  if (phase === 'distribution') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
          <div className="text-white/90 text-sm text-center">
            <p className="mb-2">
              🎭 <strong>Cada jogador deve ver apenas o seu próprio papel!</strong>
            </p>
            <p className="mb-2">
              Passem o dispositivo de jogador em jogador. Cada um revela o seu papel, memoriza, e esconde antes de passar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initialPlayers.map((player) => (
            <DistributionCard
              key={player.id}
              player={player}
              isRevealed={revealedPlayerId === player.id}
              onToggle={toggleCard}
              allRevealed={allRevealed}
            />
          ))}
        </div>

        {allRevealed && (
          <button
            onClick={() => setPhase('night-start')}
            className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
          >
            🌙 Começar a Noite
          </button>
        )}

        <button
          onClick={onBack}
          className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
        >
          ← Voltar ao Menu
        </button>
      </div>
    );
  }

  // Night start
  if (phase === 'night-start') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 text-center">
          <div className="text-8xl mb-4">🌙</div>
          <h2 className="text-white text-3xl font-bold mb-2">Noite {round}</h2>
          <p className="text-white/80 text-lg mt-4">Todos fecham os olhos.</p>
          <p className="text-white/60 text-sm mt-2">O narrador guia a noite.</p>
        </div>

        <button
          onClick={() => setPhase('night-wolves')}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          🐺 Lobisomens, abram os olhos
        </button>
      </div>
    );
  }

  // Night wolves choose victim
  if (phase === 'night-wolves') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">🐺</div>
          <h2 className="text-white text-2xl font-bold mb-2">Lobisomens</h2>
          <p className="text-white/80">Escolham a vossa vítima para esta noite.</p>
          <p className="text-white/60 text-xs mt-1">(Apenas os lobisomens devem ver este ecrã)</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <PlayerSelector
            players={alivePlayers}
            selected={wolfVictim}
            onSelect={setWolfVictim}
            label="Escolhe a vítima:"
          />
        </div>

        <button
          onClick={confirmWolfVictim}
          disabled={!wolfVictim}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar →
        </button>
      </div>
    );
  }

  // Night vidente
  if (phase === 'night-vidente') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">🔮</div>
          <h2 className="text-white text-2xl font-bold mb-2">Vidente</h2>
          <p className="text-white/80">Escolhe um jogador para ver o seu papel.</p>
          <p className="text-white/60 text-xs mt-1">(Apenas a Vidente deve ver este ecrã)</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <PlayerSelector
            players={alivePlayers}
            selected={videnteTarget}
            onSelect={setVidenteTarget}
            label="Escolhe um jogador:"
          />
        </div>

        <button
          onClick={confirmVidenteTarget}
          disabled={!videnteTarget}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ver Papel →
        </button>
      </div>
    );
  }

  // Night vidente result
  if (phase === 'night-vidente-result') {
    const target = alivePlayers.find((p) => p.id === videnteTarget);
    const isWolf = target?.role === 'lobisomem';
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">🔮</div>
          <h2 className="text-white text-2xl font-bold mb-4">{target?.name}</h2>
          <div
            className={`rounded-xl p-6 border-2 ${
              isWolf ? 'bg-red-500/20 border-red-400/50' : 'bg-green-500/20 border-green-400/50'
            }`}
          >
            <div className="text-5xl mb-2">{isWolf ? '🐺' : '👤'}</div>
            <p className="text-white text-xl font-bold">
              {isWolf ? 'É um Lobisomem!' : 'Não é Lobisomem'}
            </p>
          </div>
          <p className="text-white/60 text-xs mt-4">Memoriza e fecha os olhos.</p>
        </div>

        <button
          onClick={continueAfterVidente}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          Continuar →
        </button>
      </div>
    );
  }

  // Night medico
  if (phase === 'night-medico') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">💉</div>
          <h2 className="text-white text-2xl font-bold mb-2">Médico</h2>
          <p className="text-white/80">Escolhe um jogador para proteger esta noite.</p>
          <p className="text-white/60 text-xs mt-1">(Apenas o Médico deve ver este ecrã)</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <PlayerSelector
            players={alivePlayers}
            selected={medicoProtect}
            onSelect={setMedicoProtect}
            label="Escolhe quem proteger:"
          />
        </div>

        <button
          onClick={confirmMedicoProtect}
          disabled={!medicoProtect}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Proteger →
        </button>
      </div>
    );
  }

  // Day reveal (who died)
  if (phase === 'day-reveal') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 text-center">
          <div className="text-8xl mb-4">☀️</div>
          <h2 className="text-white text-3xl font-bold mb-4">Amanheceu!</h2>

          {nightDeaths.length === 0 ? (
            <div className="bg-green-500/20 border-2 border-green-400/50 rounded-xl p-4">
              <p className="text-white text-lg font-bold">✨ Ninguém morreu esta noite!</p>
              <p className="text-white/70 text-sm mt-1">O Médico salvou alguém.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/80">Esta noite morreram:</p>
              {nightDeaths.map((p) => (
                <div
                  key={p.id}
                  className="bg-red-500/20 border-2 border-red-400/50 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-white font-bold text-lg">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={confirmDayReveal}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          Continuar para a Votação →
        </button>
      </div>
    );
  }

  // Day hunter (hunter died, chooses target)
  if (phase === 'day-hunter') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">🏹</div>
          <h2 className="text-white text-2xl font-bold mb-2">O Caçador Morreu!</h2>
          <p className="text-white/80">
            <strong>{hunterPlayer?.name}</strong> era o Caçador e pode levar um jogador consigo.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <PlayerSelector
            players={alivePlayers}
            selected={hunterTarget}
            onSelect={setHunterTarget}
            excludeIds={hunterPlayer ? [hunterPlayer.id] : []}
            label="O Caçador escolhe quem levar:"
          />
        </div>

        <button
          onClick={confirmHunterTarget}
          disabled={!hunterTarget}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar →
        </button>
      </div>
    );
  }

  // Day vote
  if (phase === 'day-vote') {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-6xl mb-3">🗳️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Votação</h2>
          <p className="text-white/80">Os aldeões discutem e votam para eliminar um suspeito.</p>
        </div>

        {/* Alive players overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
          <h3 className="text-white font-bold mb-3 text-center">
            👥 Jogadores Vivos ({alivePlayers.filter((p) => p.alive).length})
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {alivePlayers
              .filter((p) => p.alive)
              .map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1 rounded-full text-white text-sm border border-white/30"
                  style={{ backgroundColor: p.color + '44', borderColor: p.color + '88' }}
                >
                  {p.name}
                </span>
              ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <PlayerSelector
            players={alivePlayers}
            selected={voteEliminated}
            onSelect={setVoteEliminated}
            label="Escolhe o jogador a eliminar:"
          />
        </div>

        <button
          onClick={confirmVote}
          disabled={!voteEliminated}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Eliminar →
        </button>
      </div>
    );
  }

  // Day eliminated - reveal role
  if (phase === 'day-eliminated') {
    const isWolf = eliminatedPlayer?.role === 'lobisomem';
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Eliminado!</h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: eliminatedPlayer?.color }} />
            <span className="text-white text-2xl font-bold">{eliminatedPlayer?.name}</span>
          </div>
          <div
            className={`rounded-xl p-6 border-2 ${
              isWolf ? 'bg-red-500/20 border-red-400/50' : 'bg-blue-500/20 border-blue-400/50'
            }`}
          >
            <div className="text-5xl mb-2">{eliminatedPlayer ? roleEmoji[eliminatedPlayer.role] : ''}</div>
            <p className="text-white text-xl font-bold">
              Era {eliminatedPlayer ? roleLabel[eliminatedPlayer.role] : ''}!
            </p>
            {isWolf ? (
              <p className="text-white/70 text-sm mt-2">Os aldeões acertaram! 🎉</p>
            ) : (
              <p className="text-white/70 text-sm mt-2">Os lobisomens continuam à solta... 😱</p>
            )}
          </div>
        </div>

        <button
          onClick={continueAfterEliminated}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          Continuar →
        </button>
      </div>
    );
  }

  // Finished screen
  if (phase === 'finished') {
    const wolvesWon = winner === 'lobisomens';
    return (
      <div className="space-y-6">
        <div
          className={`rounded-2xl p-8 border-2 text-center ${
            wolvesWon
              ? 'bg-red-500/20 border-red-400/50'
              : 'bg-green-500/20 border-green-400/50'
          }`}
        >
          <div className="text-8xl mb-4">{wolvesWon ? '🐺' : '🎉'}</div>
          <h2 className="text-white text-3xl font-bold mb-2">
            {wolvesWon ? 'Os Lobisomens Venceram!' : 'Os Aldeões Venceram!'}
          </h2>
          <p className="text-white/80">
            {wolvesWon
              ? 'Os lobisomens dominaram a aldeia...'
              : 'Todos os lobisomens foram eliminados!'}
          </p>
        </div>

        {/* Reveal all roles */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <h3 className="text-white font-bold mb-4 text-center">📋 Papéis Revelados</h3>
          <div className="space-y-2">
            {allPlayers.map((p) => {
              const alive = alivePlayers.find((ap) => ap.id === p.id)?.alive ?? false;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    alive
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-white font-medium">{p.name}</span>
                    {!alive && <span className="text-white/40 text-xs">(eliminado)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{roleEmoji[p.role]}</span>
                    <span className="text-white/80 text-sm">{roleLabel[p.role]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95 font-bold"
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

  return null;
}
