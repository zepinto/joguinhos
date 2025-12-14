import { useState, useEffect, useCallback } from 'react';
import { TriviaSetup } from './TriviaSetup';
import { triviaCategories, TriviaQuestion } from './questions';
import { playStartSound, playTimeUpSound, playTickSound } from '../../utils/sounds';

const STORAGE_KEY = 'trivia-used-questions';

// Load used questions from localStorage
function loadUsedQuestions(): Record<string, number[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save used questions to localStorage
function saveUsedQuestions(usedQuestions: Record<string, number[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usedQuestions));
  } catch {
    // Ignore storage errors
  }
}

// Get used question indices for a specific category
function getUsedQuestionsForCategory(category: string): Set<number> {
  const allUsed = loadUsedQuestions();
  return new Set(allUsed[category] || []);
}

// Mark a question as used for a category
function markQuestionAsUsed(category: string, index: number): void {
  const allUsed = loadUsedQuestions();
  if (!allUsed[category]) {
    allUsed[category] = [];
  }
  if (!allUsed[category].includes(index)) {
    allUsed[category].push(index);
  }
  saveUsedQuestions(allUsed);
}

// Reset used questions for a category
function resetUsedQuestionsForCategory(category: string): void {
  const allUsed = loadUsedQuestions();
  delete allUsed[category];
  saveUsedQuestions(allUsed);
}

interface TriviaProps {
  onBack: () => void;
}

type GameState = 'setup' | 'question' | 'answered' | 'timeup';

export function Trivia({ onBack }: TriviaProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [category, setCategory] = useState<keyof typeof triviaCategories>('ciencia');
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [usedCount, setUsedCount] = useState(0);

  // Load used questions from storage when category changes
  useEffect(() => {
    const stored = getUsedQuestionsForCategory(category);
    setUsedQuestions(stored);
    setUsedCount(stored.size);
  }, [category]);

  const getRandomQuestion = useCallback(() => {
    const questions = triviaCategories[category].questions;
    const storedUsed = getUsedQuestionsForCategory(category);
    const availableIndices = questions
      .map((_, idx) => idx)
      .filter(idx => !storedUsed.has(idx));
    
    if (availableIndices.length === 0) {
      // Reset if all questions used
      resetUsedQuestionsForCategory(category);
      setUsedQuestions(new Set());
      setUsedCount(0);
      const randomIdx = Math.floor(Math.random() * questions.length);
      return { question: questions[randomIdx], index: randomIdx };
    }
    
    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { question: questions[randomIdx], index: randomIdx };
  }, [category]);

  const handleStart = (selectedCategory: keyof typeof triviaCategories, selectedDuration: number) => {
    setCategory(selectedCategory);
    setDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    
    // Load used questions for this category
    const storedUsed = getUsedQuestionsForCategory(selectedCategory);
    setUsedQuestions(storedUsed);
    setUsedCount(storedUsed.size);
    
    // Get a question that hasn't been used - use selectedCategory directly
    const questions = triviaCategories[selectedCategory].questions;
    const availableIndices = questions
      .map((_, idx) => idx)
      .filter(idx => !storedUsed.has(idx));
    
    let questionIndex: number;
    if (availableIndices.length === 0) {
      questionIndex = Math.floor(Math.random() * questions.length);
    } else {
      questionIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
    
    setCurrentQuestion(questions[questionIndex]);
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(null);
    
    // Start timer immediately
    playStartSound();
    setGameState('question');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState !== 'question') return;
    
    setSelectedAnswer(answerIndex);
    setGameState('answered');
    
    // Mark question as used
    markQuestionAsUsed(category, currentQuestionIndex);
    setUsedQuestions(prev => new Set([...prev, currentQuestionIndex]));
    setUsedCount(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    const { question, index } = getRandomQuestion();
    setCurrentQuestion(question);
    setCurrentQuestionIndex(index);
    setSelectedAnswer(null);
    setTimeLeft(duration);
    playStartSound();
    setGameState('question');
  };

  const handleNewGame = () => {
    setGameState('setup');
    setSelectedAnswer(null);
  };

  const handleResetQuestions = () => {
    resetUsedQuestionsForCategory(category);
    setUsedQuestions(new Set());
    setUsedCount(0);
  };

  useEffect(() => {
    if (gameState !== 'question') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          playTimeUpSound();
          setGameState('timeup');
          // Mark question as used even if time runs out
          markQuestionAsUsed(category, currentQuestionIndex);
          setUsedQuestions(prevSet => new Set([...prevSet, currentQuestionIndex]));
          setUsedCount(prevCount => prevCount + 1);
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
  }, [gameState, category, currentQuestionIndex]);

  const isLowTime = timeLeft <= 10;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  if (gameState === 'setup') {
    return (
      <div className="christmas-overlay xmas-bg min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-white mb-2">🎯 Trivia</h1>
            <p className="text-white/90">Responde às perguntas antes do tempo acabar</p>
          </div>
          <TriviaSetup onStart={handleStart} onBack={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="christmas-overlay xmas-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-white mb-2">🎯 Trivia</h1>
        </div>

        {/* Timer Display */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
            <div className="text-center text-white/80 text-sm mb-2">Tempo restante</div>
            <div className={`text-center text-6xl mb-2 ${isLowTime ? 'text-white' : 'text-white'}`}>
              {timeLeft}s
            </div>
            <div className="text-center text-white/60 text-xs">
              {gameState === 'question' ? 'Escolhe a resposta correta!' : 'Próxima pergunta...'}
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20 shadow-2xl mb-4">
            <div className="text-white text-xl mb-6 text-center">
              {currentQuestion.question}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = 'w-full py-4 px-6 rounded-xl border-2 transition-all text-left ';
                
                if (gameState === 'question') {
                  buttonClass += 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-102 active:scale-98 cursor-pointer';
                } else {
                  // Show results
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += 'bg-green-500/80 text-white border-green-300';
                  } else if (index === selectedAnswer) {
                    buttonClass += 'bg-red-500/80 text-white border-red-300';
                  } else {
                    buttonClass += 'bg-white/10 text-white/50 border-white/20';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={gameState !== 'question'}
                    className={buttonClass}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result Messages */}
        {gameState === 'answered' && (
          <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 mb-4 text-center ${
            isCorrect ? 'border-green-300' : 'border-red-300'
          }`}>
            <div className={`text-2xl mb-2 ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
              {isCorrect ? '✅ Correto!' : '❌ Errado!'}
            </div>
            {!isCorrect && currentQuestion && (
              <div className="text-white/80">
                A resposta correta era: <span className="text-white font-medium">
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </span>
              </div>
            )}
          </div>
        )}

        {gameState === 'timeup' && currentQuestion && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center mb-4">
            <div className="text-white text-2xl mb-2">⏰ Tempo esgotado!</div>
            <div className="text-white/80">
              A resposta correta era: <span className="text-white font-medium">
                {currentQuestion.options[currentQuestion.correctAnswer]}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 space-y-4">
          {(gameState === 'answered' || gameState === 'timeup') && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              ➡️ Próxima Pergunta
            </button>
          )}

          <button
            onClick={handleNewGame}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
          >
            🔄 Nova Configuração
          </button>

          {/* Used questions counter and reset */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 text-center space-y-2">
            <div className="text-white/70 text-sm">
              Perguntas usadas: {usedCount} / {triviaCategories[category].questions.length}
            </div>
            <button
              onClick={handleResetQuestions}
              className="w-full bg-white/20 text-white py-3 px-6 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              Repor perguntas
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
