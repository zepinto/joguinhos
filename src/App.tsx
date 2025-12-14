import { useState } from 'react';
import { StartMenu } from './components/StartMenu';
import { QuemSouEu } from './components/QuemSouEu';
import { Mimica } from './components/mimica/Mimica';

type GameScreen = 'menu' | 'quem-sou-eu' | 'mimica';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameScreen>('menu');

  const handleSelectGame = (game: 'quem-sou-eu' | 'mimica') => {
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
    default:
      return <StartMenu onSelectGame={handleSelectGame} />;
  }
}