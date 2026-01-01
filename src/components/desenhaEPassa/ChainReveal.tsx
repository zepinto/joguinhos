import { useState } from 'react';

export interface ChainEntry {
  type: 'word' | 'drawing' | 'guess';
  content: string;
  playerName?: string;
}

export interface Chain {
  id: number;
  entries: ChainEntry[];
  originalWord: string;
}

interface ChainRevealProps {
  chains: Chain[];
  playerNames: string[];
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  scores: Record<number, number>;
  onUpdateScores: (newScores: Record<number, number>) => void;
}

export function ChainReveal({ 
  chains, 
  playerNames,
  onPlayAgain, 
  onBackToMenu,
  scores,
  onUpdateScores 
}: ChainRevealProps) {
  const [currentChain, setCurrentChain] = useState(0);
  const [votedChains, setVotedChains] = useState<Set<number>>(new Set());

  const chain = chains[currentChain];

  const handlePrevious = () => {
    if (currentChain > 0) {
      setCurrentChain(currentChain - 1);
    }
  };

  const handleNext = () => {
    if (currentChain < chains.length - 1) {
      setCurrentChain(currentChain + 1);
    }
  };

  const handleVote = (success: boolean) => {
    if (votedChains.has(currentChain)) return;

    setVotedChains(new Set([...votedChains, currentChain]));

    if (success) {
      // Award 1 point to all players
      const newScores = { ...scores };
      playerNames.forEach((_, index) => {
        newScores[index] = (newScores[index] || 0) + 1;
      });
      onUpdateScores(newScores);
    }
  };

  const hasVoted = votedChains.has(currentChain);
  const finalEntry = chain.entries[chain.entries.length - 1];
  const finalGuess = finalEntry.type === 'guess' ? finalEntry.content : '';

  return (
    <div className="space-y-4">
      {/* Chain Navigation */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentChain === 0}
            className={`py-2 px-4 rounded-xl transition-all ${
              currentChain === 0
                ? 'text-white/30'
                : 'text-white hover:bg-white/20 active:scale-95'
            }`}
          >
            ← Anterior
          </button>
          <div className="text-white font-bold">
            Cadeia {currentChain + 1} de {chains.length}
          </div>
          <button
            onClick={handleNext}
            disabled={currentChain === chains.length - 1}
            className={`py-2 px-4 rounded-xl transition-all ${
              currentChain === chains.length - 1
                ? 'text-white/30'
                : 'text-white hover:bg-white/20 active:scale-95'
            }`}
          >
            Próxima →
          </button>
        </div>
      </div>

      {/* Chain Entries */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 space-y-4">
        <h3 className="text-white font-bold text-xl text-center mb-4">
          📜 Evolução da Cadeia
        </h3>

        {chain.entries.map((entry, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
            {entry.type === 'word' && (
              <div>
                <div className="text-white/70 text-sm mb-2">
                  {index === 0 ? '📝 Palavra Original' : '✍️ Adivinhação'}
                  {entry.playerName && ` - ${entry.playerName}`}
                </div>
                <div className="text-white text-xl font-bold text-center">
                  {entry.content}
                </div>
              </div>
            )}

            {entry.type === 'drawing' && (
              <div>
                <div className="text-white/70 text-sm mb-2">
                  🎨 Desenho
                  {entry.playerName && ` - ${entry.playerName}`}
                </div>
                <img
                  src={entry.content}
                  alt="Desenho"
                  className="w-full rounded-lg bg-white"
                />
              </div>
            )}

            {entry.type === 'guess' && (
              <div>
                <div className="text-white/70 text-sm mb-2">
                  ✍️ Adivinhação
                  {entry.playerName && ` - ${entry.playerName}`}
                </div>
                <div className="text-white text-xl font-bold text-center">
                  {entry.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Voting Section */}
      {!hasVoted && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <h3 className="text-white font-bold text-center mb-4">
            🎯 A cadeia acertou?
          </h3>
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="text-white/70 text-sm">Original:</div>
            <div className="text-white text-lg font-bold">{chain.originalWord}</div>
            <div className="text-white/70 text-sm mt-2">Final:</div>
            <div className="text-white text-lg font-bold">{finalGuess}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleVote(false)}
              className="bg-red-500/80 text-white py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 font-bold"
            >
              ❌ Não
            </button>
            <button
              onClick={() => handleVote(true)}
              className="bg-green-500/80 text-white py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 font-bold"
            >
              ✓ Sim
            </button>
          </div>
        </div>
      )}

      {hasVoted && (
        <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-4 border-2 border-green-500/40 text-center">
          <div className="text-white font-bold">✓ Votado!</div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
        <h3 className="text-white font-bold text-xl text-center mb-4">
          🏆 Pontuação
        </h3>
        <div className="space-y-2">
          {playerNames.map((name, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white/10 rounded-xl p-3"
            >
              <span className="text-white font-medium">{name}</span>
              <span className="text-white font-bold text-xl">
                {scores[index] || 0} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onBackToMenu}
          className="bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
        >
          ← Menu
        </button>
        <button
          onClick={onPlayAgain}
          className="bg-white text-purple-600 py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          🔄 Jogar Novamente
        </button>
      </div>
    </div>
  );
}
