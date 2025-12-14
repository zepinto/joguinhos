import { useState } from 'react';
import { StartMenu } from './components/StartMenu';
import { QuemSouEu } from './components/QuemSouEu';
import { Mimica } from './components/mimica/Mimica';
import { Trivia } from './components/trivia/Trivia';

type GameScreen = 'menu' | 'quem-sou-eu' | 'mimica' | 'trivia';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameScreen>('menu');

  const handleSelectGame = (game: 'quem-sou-eu' | 'mimica' | 'trivia') => {
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
    default:
      return <StartMenu onSelectGame={handleSelectGame} />;
  }
}