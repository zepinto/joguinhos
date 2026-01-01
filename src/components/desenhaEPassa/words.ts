const parseList = (text: string): string[] => {
  const items = text
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return Array.from(new Set(items));
};

export const desenhaEPassaCategories = {
  animais: parseList(`
    Cão, Gato, Leão, Tigre, Elefante, Girafa, Macaco, Gorila, Urso, Panda, Coala, Canguru, Coelho, Rato, Esquilo, Cavalo, Zebra, Ovelha, Vaca, Porco, Crocodilo, Tartaruga, Cobra, Sapo, Pássaro, Águia, Coruja, Flamingo, Pato, Galinha, Pinguim, Papagaio, Tucano, Morcego, Baleia, Golfinho, Tubarão, Peixe, Polvo, Caranguejo, Borboleta, Abelha, Joaninha, Aranha
  `),

  profissoes: parseList(`
    Polícia, Médico, Enfermeiro, Bombeiro, Professor, Cozinheiro, Padeiro, Pintor, Cantor, Bailarino, Palhaço, Mágico, Futebolista, Fotógrafo, Músico, Astronauta, Pirata, Cowboy, Ninja, Rei, Rainha
  `),

  objetos: parseList(`
    Cadeira, Mesa, Cama, Telefone, Computador, Televisão, Relógio, Livro, Caneta, Tesoura, Guarda-chuva, Óculos, Chave, Carro, Bicicleta, Avião, Barco, Comboio, Foguetão, Balão, Bola, Piano, Guitarra, Tambor, Coração, Estrela, Lua, Sol, Nuvem, Arco-íris, Árvore, Flor, Casa, Castelo, Torre, Ponte
  `),

  comida: parseList(`
    Pizza, Hambúrguer, Cachorro, Bolo, Gelado, Chocolate, Bolacha, Pão, Queijo, Ovo, Maçã, Banana, Laranja, Morango, Melancia, Cereja, Uva, Cenoura, Batata, Tomate, Pipocas, Café, Chá, Sumo
  `),

  desportos: parseList(`
    Futebol, Basquetebol, Ténis, Natação, Surf, Ski, Patins, Bicicleta, Corrida, Salto, Boxe, Yoga, Dança, Golfe
  `),

  natureza: parseList(`
    Montanha, Mar, Rio, Praia, Floresta, Árvore, Flor, Nuvem, Chuva, Sol, Lua, Estrela, Relâmpago, Arco-íris, Vulcão, Ilha, Cachoeira
  `),
};

export const categoryLabels: Record<keyof typeof desenhaEPassaCategories, string> = {
  animais: '🦁 Animais',
  profissoes: '👮 Profissões',
  objetos: '🎯 Objetos',
  comida: '🍕 Comida',
  desportos: '⚽ Desportos',
  natureza: '🌍 Natureza',
};
