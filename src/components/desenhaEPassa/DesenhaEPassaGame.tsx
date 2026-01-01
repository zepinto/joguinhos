import { useState, useEffect } from 'react';
import { DrawingCanvas } from './DrawingCanvas';
import { ChainReveal, Chain, ChainEntry } from './ChainReveal';
import { GameConfig } from './DesenhaEPassaSetup';
import { desenhaEPassaCategories } from './words';
import { playStartSound, playTimeUpSound, playTickSound } from '../../utils/sounds';

interface DesenhaEPassaGameProps {
  config: GameConfig;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

type GamePhase = 'ready' | 'drawing' | 'guessing' | 'reveal' | 'timeup';

interface GameState {
  phase: GamePhase;
  currentPlayerIndex: number;
  currentChainIndex: number;
  timeLeft: number;
}

export function DesenhaEPassaGame({ config, onNewGame, onBackToMenu }: DesenhaEPassaGameProps) {
  const [chains, setChains] = useState<Chain[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'ready',
    currentPlayerIndex: 0,
    currentChainIndex: 0,
    timeLeft: config.drawingTime,
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [scores, setScores] = useState<Record<number, number>>({});

  // Initialize chains with random words
  useEffect(() => {
    const words = desenhaEPassaCategories[config.category];
    const initialChains: Chain[] = [];

    for (let i = 0; i < config.numPlayers; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      initialChains.push({
        id: i,
        entries: [
          {
            type: 'word',
            content: randomWord,
            playerName: config.playerNames[i],
          },
        ],
        originalWord: randomWord,
      });
    }

    setChains(initialChains);

    // Load scores from localStorage
    const storedScores = localStorage.getItem('desenha-e-passa-scores');
    if (storedScores) {
      try {
        setScores(JSON.parse(storedScores));
      } catch {
        // Ignore errors
      }
    }
  }, [config]);

  // Update scores in localStorage
  useEffect(() => {
    localStorage.setItem('desenha-e-passa-scores', JSON.stringify(scores));
  }, [scores]);

  // Timer logic
  useEffect(() => {
    if (gameState.phase !== 'drawing' && gameState.phase !== 'guessing') return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTimeLeft = prev.timeLeft - 1;

        if (newTimeLeft <= 0) {
          clearInterval(timer);
          playTimeUpSound();
          return { ...prev, phase: 'timeup', timeLeft: 0 };
        }

        // Play tick sound in last 5 seconds
        if (newTimeLeft <= 5) {
          playTickSound();
        }

        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.phase]);

  const getCurrentChain = () => chains[gameState.currentChainIndex];
  const getCurrentPlayer = () => config.playerNames[gameState.currentPlayerIndex];

  const isDrawingPhase = () => {
    const chain = getCurrentChain();
    const lastEntry = chain.entries[chain.entries.length - 1];
    return lastEntry.type === 'word' || lastEntry.type === 'guess';
  };

  const handleStart = () => {
    playStartSound();
    const isDrawing = isDrawingPhase();
    setGameState({
      ...gameState,
      phase: isDrawing ? 'drawing' : 'guessing',
      timeLeft: isDrawing ? config.drawingTime : config.guessingTime,
    });
  };

  const handleSaveDrawing = (dataUrl: string) => {
    const newChains = [...chains];
    const chain = newChains[gameState.currentChainIndex];
    
    chain.entries.push({
      type: 'drawing',
      content: dataUrl,
      playerName: getCurrentPlayer(),
    });

    setChains(newChains);
    advanceToNextTurn();
  };

  const handleSaveGuess = () => {
    if (!currentGuess.trim()) return;

    const newChains = [...chains];
    const chain = newChains[gameState.currentChainIndex];
    
    chain.entries.push({
      type: 'guess',
      content: currentGuess.trim(),
      playerName: getCurrentPlayer(),
    });

    setChains(newChains);
    setCurrentGuess('');
    advanceToNextTurn();
  };

  const advanceToNextTurn = () => {
    const nextPlayerIndex = gameState.currentPlayerIndex + 1;
    const nextChainIndex = (gameState.currentChainIndex + 1) % config.numPlayers;

    // Check if game is complete (all players have contributed to all chains)
    const allChainsComplete = chains.every(
      (chain) => chain.entries.length >= config.numPlayers
    );

    if (allChainsComplete && nextPlayerIndex >= config.numPlayers) {
      setGameState({ ...gameState, phase: 'reveal' });
      return;
    }

    // Move to next player or next round
    if (nextPlayerIndex >= config.numPlayers) {
      // Start new round with first player
      setGameState({
        phase: 'ready',
        currentPlayerIndex: 0,
        currentChainIndex: nextChainIndex,
        timeLeft: config.drawingTime,
      });
    } else {
      setGameState({
        phase: 'ready',
        currentPlayerIndex: nextPlayerIndex,
        currentChainIndex: nextChainIndex,
        timeLeft: config.drawingTime,
      });
    }
  };

  const handleSkipTimeup = () => {
    // On timeout, add empty entry and continue
    const newChains = [...chains];
    const chain = newChains[gameState.currentChainIndex];
    const isDrawing = isDrawingPhase();

    if (isDrawing) {
      // Add empty drawing (white canvas)
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        chain.entries.push({
          type: 'drawing',
          content: dataUrl,
          playerName: getCurrentPlayer(),
        });
      }
    } else {
      // Add "???" as guess
      chain.entries.push({
        type: 'guess',
        content: '???',
        playerName: getCurrentPlayer(),
      });
    }

    setChains(newChains);
    advanceToNextTurn();
  };

  if (gameState.phase === 'reveal') {
    return <ChainReveal 
      chains={chains} 
      playerNames={config.playerNames}
      onPlayAgain={onNewGame} 
      onBackToMenu={onBackToMenu}
      scores={scores}
      onUpdateScores={setScores}
    />;
  }

  const chain = getCurrentChain();
  const lastEntry = chain.entries[chain.entries.length - 1];
  const isDrawing = isDrawingPhase();

  if (gameState.phase === 'ready') {
    return (
      <div className="space-y-4">
        {/* Player Turn Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <div className="text-center">
            <div className="text-white/80 text-lg mb-2">Vez de:</div>
            <div className="text-white text-3xl font-bold mb-4">
              {getCurrentPlayer()}
            </div>
            <div className="text-white/80 text-lg">
              {isDrawing ? '🎨 Vais Desenhar' : '✍️ Vais Adivinhar'}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <div className="text-white/90 text-center space-y-2">
            {isDrawing ? (
              <>
                <p>Vais ver uma palavra e tens de a desenhar!</p>
                <p className="text-sm text-white/70">
                  Tempo: {config.drawingTime} segundos
                </p>
              </>
            ) : (
              <>
                <p>Vais ver um desenho e tens de adivinhar o que é!</p>
                <p className="text-sm text-white/70">
                  Tempo: {config.guessingTime} segundos
                </p>
              </>
            )}
          </div>
        </div>

        {/* Pass Phone Warning */}
        <div className="bg-yellow-500/20 backdrop-blur-md rounded-2xl p-4 border-2 border-yellow-500/40">
          <div className="text-white text-center text-sm">
            ⚠️ Passa o telemóvel para {getCurrentPlayer()}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          ▶️ Começar
        </button>
      </div>
    );
  }

  if (gameState.phase === 'timeup') {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 text-center">
          <div className="text-white text-3xl mb-4">⏰ Tempo Esgotado!</div>
          <div className="text-white/80">
            Não te preocupes, vamos continuar!
          </div>
        </div>

        <button
          onClick={handleSkipTimeup}
          className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          Continuar →
        </button>
      </div>
    );
  }

  if (gameState.phase === 'drawing') {
    return (
      <DrawingCanvas
        word={lastEntry.content}
        timeLeft={gameState.timeLeft}
        onSave={handleSaveDrawing}
      />
    );
  }

  // guessing phase
  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <div className="text-center">
          <div className={`text-4xl font-bold ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            {gameState.timeLeft}s
          </div>
        </div>
      </div>

      {/* Drawing Display */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <div className="text-white/80 text-sm mb-2 text-center">O que achas que é?</div>
        {lastEntry.type === 'drawing' && (
          <img
            src={lastEntry.content}
            alt="Desenho para adivinhar"
            className="w-full rounded-lg bg-white"
          />
        )}
      </div>

      {/* Guess Input */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
        <label className="block text-white/80 text-sm mb-2">
          Escreve a tua adivinhação:
        </label>
        <input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && currentGuess.trim()) {
              handleSaveGuess();
            }
          }}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="A tua adivinhação..."
          autoFocus
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSaveGuess}
        disabled={!currentGuess.trim()}
        className={`w-full py-4 px-6 rounded-xl transition-all font-bold ${
          currentGuess.trim()
            ? 'bg-white text-purple-600 hover:scale-105 active:scale-95 shadow-lg'
            : 'bg-white/20 text-white/50 border-2 border-white/20'
        }`}
      >
        ✓ Confirmar
      </button>
    </div>
  );
}
