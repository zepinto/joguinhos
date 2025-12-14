import { useState, useEffect, useCallback } from 'react';
import { MimicaSetup } from './MimicaSetup';
import { mimicaCategories } from './categories';
import { playStartSound, playTimeUpSound, playTickSound } from '../../utils/sounds';

const STORAGE_KEY = 'mimica-used-words';

// Load used words from localStorage
function loadUsedWords(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save used words to localStorage
function saveUsedWords(usedWords: Record<string, string[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usedWords));
  } catch {
    // Ignore storage errors
  }
}

// Get used words for a specific category
function getUsedWordsForCategory(category: string): Set<string> {
  const allUsed = loadUsedWords();
  return new Set(allUsed[category] || []);
}

// Mark a word as used for a category
function markWordAsUsed(category: string, word: string): void {
  const allUsed = loadUsedWords();
  if (!allUsed[category]) {
    allUsed[category] = [];
  }
  if (!allUsed[category].includes(word)) {
    allUsed[category].push(word);
  }
  saveUsedWords(allUsed);
}

// Reset used words for a category
function resetUsedWordsForCategory(category: string): void {
  const allUsed = loadUsedWords();
  delete allUsed[category];
  saveUsedWords(allUsed);
}

// Reset all used words
function resetAllUsedWords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

interface MimicaProps {
  onBack: () => void;
}

type GameState = 'setup' | 'ready' | 'playing' | 'timeup';

export function Mimica({ onBack }: MimicaProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [category, setCategory] = useState<keyof typeof mimicaCategories>('verbosAcao');
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [usedCount, setUsedCount] = useState(0);

  // Load used words from storage when category changes
  useEffect(() => {
    const stored = getUsedWordsForCategory(category);
    setUsedWords(stored);
    setUsedCount(stored.size);
  }, [category]);

  const getRandomWord = useCallback(() => {
    const words = mimicaCategories[category];
    const storedUsed = getUsedWordsForCategory(category);
    const availableWords = words.filter(w => !storedUsed.has(w));
    
    if (availableWords.length === 0) {
      // Reset if all words used
      resetUsedWordsForCategory(category);
      setUsedWords(new Set());
      setUsedCount(0);
      return words[Math.floor(Math.random() * words.length)];
    }
    
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }, [category]);

  const handleReveal = () => {
    if (gameState === 'playing') return;
    
    if (!isRevealed) {
      // Mark word as used when revealed
      markWordAsUsed(category, currentWord);
      setUsedWords(prev => new Set([...prev, currentWord]));
      setUsedCount(prev => prev + 1);
    }
    setIsRevealed(!isRevealed);
  };

  const handleStart = (selectedCategory: keyof typeof mimicaCategories, selectedDuration: number) => {
    setCategory(selectedCategory);
    setDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    
    // Load used words for this category
    const storedUsed = getUsedWordsForCategory(selectedCategory);
    setUsedWords(storedUsed);
    setUsedCount(storedUsed.size);
    
    // Get a word that hasn't been used
    const words = mimicaCategories[selectedCategory];
    const availableWords = words.filter(w => !storedUsed.has(w));
    
    let word: string;
    if (availableWords.length === 0) {
      // Reset if all words used
      resetUsedWordsForCategory(selectedCategory);
      setUsedWords(new Set());
      setUsedCount(0);
      word = words[Math.floor(Math.random() * words.length)];
    } else {
      word = availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    
    setCurrentWord(word);
    setIsRevealed(false);
    setGameState('ready');
  };

  const handlePlay = () => {
    playStartSound();
    setGameState('playing');
    setTimeLeft(duration);
  };

  const handleNextCard = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setIsRevealed(false);
    setTimeLeft(duration);
    setGameState('ready');
  };

  const handleNewGame = () => {
    setGameState('setup');
    setIsRevealed(false);
  };

  const handleResetWords = () => {
    resetUsedWordsForCategory(category);
    setUsedWords(new Set());
    setUsedCount(0);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          playTimeUpSound();
          setGameState('timeup');
          return 0;
        }
        // Play tick sound in last 5 seconds
        if (prev <= 6) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const isLowTime = timeLeft <= 10;

  if (gameState === 'setup') {
    return (
      <div className="christmas-overlay xmas-bg min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-white mb-2">🎬 Mímica</h1>
            <p className="text-white/90">Representa a palavra antes do tempo acabar</p>
          </div>
          <MimicaSetup onStart={handleStart} onBack={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="christmas-overlay xmas-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🎬 Mímica</h1>
        </div>

        {/* Timer Display */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
            <div className="text-center text-white/80 text-sm mb-2">Tempo restante</div>
            <div className={`text-center text-6xl mb-2 ${isLowTime ? 'text-white' : 'text-white'}`}>
              {timeLeft}s
            </div>
            <div className="text-center text-white/60 text-xs">
              {gameState === 'playing' ? 'A contar...' : 'Pronto para começar'}
            </div>
          </div>
        </div>

        {/* Word Card */}
        <button
          onClick={handleReveal}
          disabled={gameState === 'playing'}
          className={`w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 border-4 border-white/30 shadow-2xl min-h-[200px] flex flex-col items-center justify-center transition-all ${
            gameState !== 'playing' ? 'hover:bg-white/30 cursor-pointer active:scale-95' : ''
          }`}
        >
          {!isRevealed ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎴</div>
              <div className="text-white/80">Toca para revelar</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-white text-2xl break-words">{currentWord}</div>
              {gameState === 'ready' && (
                <div className="text-white/60 text-sm mt-4">Toca para esconder</div>
              )}
            </div>
          )}
        </button>

        {/* Action Buttons */}
        <div className="mt-4 space-y-4">
          {gameState === 'ready' && (
            <button
              onClick={handlePlay}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              ▶️ Jogar
            </button>
          )}

          {gameState === 'timeup' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center">
                <div className="text-white text-2xl mb-2">⏰ Tempo esgotado!</div>
                <div className="text-white/80">A palavra era: <span className="text-white">{currentWord}</span></div>
              </div>
              <button
                onClick={handleNextCard}
                className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
              >
                🎴 Próxima Carta
              </button>
            </>
          )}

          {gameState === 'playing' && (
            <div className="text-center text-white/70 py-4">
              A representar... Boa sorte! 🎭
            </div>
          )}

          <button
            onClick={handleNewGame}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
          >
            🔄 Nova Configuração
          </button>

          {/* Used words counter and reset */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center space-y-2">
            <div className="text-white/70 text-sm">
              Cartas usadas: {usedCount} / {mimicaCategories[category].length}
            </div>
            <button
              onClick={handleResetWords}
              className="w-full bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              Repor cartas
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-95"
          >
            ← Voltar ao Menu
          </button>
        </div>
      </div>
    </div>
  );
}
