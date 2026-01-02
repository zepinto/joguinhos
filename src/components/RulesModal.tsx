import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: 'quem-sou-eu' | 'mimica' | 'trivia' | 'intruso' | 'desenha-e-passa';
}

const gameRules = {
  'quem-sou-eu': {
    title: '🎭 Quem Sou Eu?',
    rules: [
      'Cada jogador recebe uma carta com o nome de uma pessoa famosa, personagem ou objeto.',
      'A carta é colocada de forma que todos vejam menos o próprio jogador.',
      'À vez, cada jogador faz perguntas de sim/não para descobrir quem é.',
      'Exemplos: "Sou uma pessoa real?", "Estou vivo?", "Sou português?"',
      'Ganha quem adivinhar primeiro a sua identidade!',
    ],
  },
  'mimica': {
    title: '🎬 Mímica',
    rules: [
      'Um jogador vê uma palavra secreta no ecrã.',
      'Tem de representar essa palavra apenas com gestos, sem falar!',
      'Os outros jogadores tentam adivinhar a palavra.',
      'Não podes apontar para objetos na sala nem fazer sons.',
      'Se acertarem antes do tempo acabar, ganham um ponto!',
      'Passem o telemóvel ao próximo jogador e continuem.',
    ],
  },
  'trivia': {
    title: '🎯 Trivia',
    rules: [
      'São apresentadas perguntas de cultura geral com múltipla escolha.',
      'Cada jogador ou equipa escolhe a resposta que acha correta.',
      'Ganham pontos por cada resposta certa.',
      'As perguntas podem ser sobre história, ciência, desporto, entretenimento, e mais!',
      'Quem tiver mais pontos no final ganha!',
    ],
  },
  'intruso': {
    title: '🕵️ Intruso',
    rules: [
      '👤 Civis recebem todos a mesma palavra secreta.',
      '🕵️ Intrusos recebem uma palavra semelhante mas diferente.',
      '❓ Mr. White não recebe palavra nenhuma!',
      'À vez, cada jogador diz uma palavra ou frase que descreva a sua palavra.',
      'Não sejas óbvio demais ou os intrusos descobrem a palavra!',
      'Não sejas vago demais ou pareces suspeito!',
      'Depois de todos falarem, votem em quem acham que é o intruso.',
      'Se o Mr. White for apanhado, pode tentar adivinhar a palavra para ganhar!',
      'O jogador que começa nunca pode ser Mr. White.',
    ],
  },
  'desenha-e-passa': {
    title: '🎨 Desenha e Passa',
    rules: [
      'Cada jogador começa com uma palavra aleatória.',
      'Desenha essa palavra no ecrã (sem escrever letras!).',
      'Passa o telemóvel ao próximo jogador.',
      'O próximo jogador vê o desenho e escreve o que acha que é.',
      'A sua resposta passa ao jogador seguinte, que desenha essa palavra.',
      'Alterna entre desenhar e adivinhar até voltar ao início.',
      'No final, vejam como a palavra original evoluiu - normalmente com resultados hilariantes!',
    ],
  },
};

export function RulesModal({ isOpen, onClose, gameId }: RulesModalProps) {
  if (!isOpen) return null;

  const { title, rules } = gameRules[gameId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start">
              <span className="text-white/60 mr-2 flex-shrink-0">•</span>
              <p className="text-white/90 text-sm">{rule}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-white text-purple-600 py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg font-bold"
        >
          Entendi!
        </button>
      </div>
    </div>
  );
}
