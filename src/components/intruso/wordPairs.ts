// Word pairs for the Intruso (Undercover) game
// Each pair contains a civilian word and an undercover word (similar but different)

export interface WordPair {
  civilian: string;
  undercover: string;
}

export const wordPairs: WordPair[] = [
  // Food & Drinks
  { civilian: 'Café', undercover: 'Chá' },
  { civilian: 'Pizza', undercover: 'Hambúrguer' },
  { civilian: 'Gelado', undercover: 'Sorvete' },
  { civilian: 'Chocolate', undercover: 'Caramelo' },
  { civilian: 'Água', undercover: 'Sumo' },
  { civilian: 'Pão', undercover: 'Bolo' },
  { civilian: 'Arroz', undercover: 'Massa' },
  { civilian: 'Maçã', undercover: 'Pera' },
  { civilian: 'Laranja', undercover: 'Tangerina' },
  { civilian: 'Frango', undercover: 'Peru' },
  
  // Animals
  { civilian: 'Cão', undercover: 'Gato' },
  { civilian: 'Leão', undercover: 'Tigre' },
  { civilian: 'Cavalo', undercover: 'Zebra' },
  { civilian: 'Coelho', undercover: 'Lebre' },
  { civilian: 'Elefante', undercover: 'Rinoceronte' },
  { civilian: 'Pato', undercover: 'Ganso' },
  { civilian: 'Urso', undercover: 'Panda' },
  { civilian: 'Abelha', undercover: 'Vespa' },
  { civilian: 'Tubarão', undercover: 'Golfinho' },
  { civilian: 'Águia', undercover: 'Falcão' },
  
  // Objects & Things
  { civilian: 'Cadeira', undercover: 'Sofá' },
  { civilian: 'Mesa', undercover: 'Secretária' },
  { civilian: 'Carro', undercover: 'Mota' },
  { civilian: 'Bicicleta', undercover: 'Trotinete' },
  { civilian: 'Caneta', undercover: 'Lápis' },
  { civilian: 'Livro', undercover: 'Revista' },
  { civilian: 'Telemóvel', undercover: 'Tablet' },
  { civilian: 'Televisão', undercover: 'Monitor' },
  { civilian: 'Relógio', undercover: 'Despertador' },
  { civilian: 'Sapato', undercover: 'Chinelo' },
  
  // Places
  { civilian: 'Praia', undercover: 'Piscina' },
  { civilian: 'Montanha', undercover: 'Colina' },
  { civilian: 'Cinema', undercover: 'Teatro' },
  { civilian: 'Restaurante', undercover: 'Café' },
  { civilian: 'Hospital', undercover: 'Clínica' },
  { civilian: 'Escola', undercover: 'Universidade' },
  { civilian: 'Parque', undercover: 'Jardim' },
  { civilian: 'Biblioteca', undercover: 'Livraria' },
  { civilian: 'Ginásio', undercover: 'Estádio' },
  { civilian: 'Aeroporto', undercover: 'Estação' },
  
  // Activities
  { civilian: 'Correr', undercover: 'Caminhar' },
  { civilian: 'Nadar', undercover: 'Mergulhar' },
  { civilian: 'Dançar', undercover: 'Cantar' },
  { civilian: 'Ler', undercover: 'Escrever' },
  { civilian: 'Pintar', undercover: 'Desenhar' },
  { civilian: 'Cozinhar', undercover: 'Assar' },
  { civilian: 'Dormir', undercover: 'Descansar' },
  { civilian: 'Estudar', undercover: 'Aprender' },
  { civilian: 'Jogar', undercover: 'Brincar' },
  { civilian: 'Viajar', undercover: 'Passear' },
  
  // Weather & Nature
  { civilian: 'Sol', undercover: 'Lua' },
  { civilian: 'Chuva', undercover: 'Neve' },
  { civilian: 'Vento', undercover: 'Brisa' },
  { civilian: 'Flor', undercover: 'Árvore' },
  { civilian: 'Rio', undercover: 'Lago' },
  { civilian: 'Mar', undercover: 'Oceano' },
  { civilian: 'Nuvem', undercover: 'Nevoeiro' },
  { civilian: 'Estrela', undercover: 'Planeta' },
  { civilian: 'Fogo', undercover: 'Chama' },
  { civilian: 'Pedra', undercover: 'Rocha' },
  
  // Professions
  { civilian: 'Médico', undercover: 'Enfermeiro' },
  { civilian: 'Professor', undercover: 'Instrutor' },
  { civilian: 'Polícia', undercover: 'Segurança' },
  { civilian: 'Bombeiro', undercover: 'Socorrista' },
  { civilian: 'Cozinheiro', undercover: 'Padeiro' },
  { civilian: 'Cantor', undercover: 'Músico' },
  { civilian: 'Ator', undercover: 'Modelo' },
  { civilian: 'Pintor', undercover: 'Escultor' },
  { civilian: 'Escritor', undercover: 'Jornalista' },
  { civilian: 'Piloto', undercover: 'Comandante' },
  
  // Sports
  { civilian: 'Futebol', undercover: 'Futsal' },
  { civilian: 'Basquetebol', undercover: 'Voleibol' },
  { civilian: 'Ténis', undercover: 'Badminton' },
  { civilian: 'Natação', undercover: 'Polo Aquático' },
  { civilian: 'Ciclismo', undercover: 'Atletismo' },
  { civilian: 'Boxe', undercover: 'Karate' },
  { civilian: 'Golf', undercover: 'Mini-golf' },
  { civilian: 'Esqui', undercover: 'Snowboard' },
  { civilian: 'Surf', undercover: 'Bodyboard' },
  { civilian: 'Ginástica', undercover: 'Acrobacia' },
  
  // Technology
  { civilian: 'Computador', undercover: 'Portátil' },
  { civilian: 'Rato', undercover: 'Teclado' },
  { civilian: 'Internet', undercover: 'Wi-Fi' },
  { civilian: 'Email', undercover: 'Mensagem' },
  { civilian: 'Aplicação', undercover: 'Programa' },
  { civilian: 'Website', undercover: 'Blog' },
  { civilian: 'Jogo', undercover: 'Videojogo' },
  { civilian: 'Fotografia', undercover: 'Vídeo' },
  { civilian: 'Música', undercover: 'Podcast' },
  { civilian: 'Câmara', undercover: 'Webcam' },
];
