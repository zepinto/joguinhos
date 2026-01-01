import { useState } from 'react';
import { StartMenu } from './components/StartMenu';
import { QuemSouEu } from './components/QuemSouEu';
import { Mimica } from './components/mimica/Mimica';
import { Trivia } from './components/trivia/Trivia';
import { Intruso } from './components/intruso/Intruso';

type GameScreen = 'menu' | 'quem-sou-eu' | 'mimica' | 'trivia' | 'intruso';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameScreen>('menu');

  const handleSelectGame = (game: 'quem-sou-eu' | 'mimica' | 'trivia' | 'intruso') => {
    setCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setCurrentGame('menu');
  };

  switch (currentGame) {
    case 'quem-sou-eu':
      return <QuemSouEu onBack={handleBackToMenu} />;
    case 'mimica':
      return <Mimica onBack={handleBackToMenu} />;
    case 'trivia':
      return <Trivia onBack={handleBackToMenu} />;
    case 'intruso':
      return <Intruso onBack={handleBackToMenu} />;
    default:
      return <StartMenu onSelectGame={handleSelectGame} />;
  }
}