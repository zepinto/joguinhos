const parseList = (text: string): string[] => {
  const items = text
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return Array.from(new Set(items));
};

export const mimicaCategories = {
  verbosAcao: parseList(`
    Correr, Saltar, Caminhar, Rastejar, Nadar, Mergulhar, Boiar, Voar, Escalar, Escorregar, Tropeçar, Cair, Levantar, Sentar, Deitar, Ajoelhar, Agachar, Rebolar, Dançar, Girar, Tremer, Balançar, Esticar, Encolher, Esconder, Fugir, Perseguir, Agarrar, Largar, Puxar, Empurrar, Arrastar, Carregar, Atirar, Apanhar, Pontapear, Socar, Bater, Esmagar, Partir, Rasgar, Furar, Cortar, Serrar, Martelar, Aparafusar, Lixar, Pintar, Varrer, Esfregar, Aspirar, Limpar, Lavar, Secar, Torcer, Engomar, Dobrar, Cozinhar, Mexer, Provar, Comer, Beber, Mastigar, Engolir, Lamber, Soprar, Morder, Cuspir, Engasgar, Vomitar, Arrotar, Espirrar, Tossir, Bocejar, Ressonar, Dormir, Acordar, Espreguiçar, Coçar, Pentear, Escovar, Barbear, Maquilhar, Vestir, Despir, Calçar, Apertar, Abotoar, Atar, Desatar, Fechar, Abrir, Trancar, Destrancar, Tocar, Escrever, Ler, Desenhar, Apagar, Rasurar, Carimbar, Agrafar, Colar, Recortar, Embrulhar, Desembrulhar, Oferecer, Receber, Roubar, Procurar, Encontrar, Perder, Ganhar, Chorar, Rir, Sorrir, Gritar, Sussurrar, Cantar, Assobiar, Falar, Discutir, Telefonar, Teclar, Clicar, Fotografar, Filmar, Pagar, Comprar, Vender, Conduzir, Pilotar, Remar, Pedalar, Travão, Acelerar, Buzinar, Estacionar, Chocar, Pescar, Caçar, Disparar, Cavar, Plantar, Regar, Colher, Podar, Ordenhar, Tosquiar, Abater, Construir, Demolir, Soldar, Coser, Tricotar, Bordar, Rezar, Meditar, Pensar, Esquecer, Lembrar, Sonhar, Imaginar, Inventar, Mentir, Confessar, Jurar, Prometer, Casar, Divorciar, Abraçar, Beijar, Cumprimentar, Acenar, Aplaudir, Vaiar, Votar, Protestar, Desfilar, Combater, Render-se, Atacar, Defender, Sangrar, Curar, Operar, Examinar, Nascer, Morrer
  `),

  animais: parseList(`
    Cão, Gato, Leão, Tigre, Elefante, Girafa, Macaco, Gorila, Chimpanzé, Urso, Panda, Coala, Preguiça, Canguru, Coelho, Rato, Hamster, Esquilo, Castor, Lontra, Porco, Vaca, Touro, Boi, Cavalo, Burro, Zebra, Ovelha, Cabra, Bode, Camelo, Dromedário, Lama, Veado, Alce, Lobo, Raposa, Hiena, Lince, Pantera, Jaguar, Leopardo, Chita, Hipopótamo, Rinoceronte, Javali, Búfalo, Crocodilo, Jacaré, Tartaruga, Cágado, Cobra, Lagarto, Camaleão, Iguana, Sapo, Rã, Salamandra, Dinossauro, Dragão, Pássaro, Águia, Falcão, Coruja, Mocho, Abutre, Cegonha, Flamingo, Garça, Cisne, Pato, Ganso, Peru, Galinha, Galo, Pinto, Avestruz, Ema, Pinguim, Papagaio, Arara, Tucano, Beija-flor, Gaivota, Pelicano, Morcego, Baleia, Golfinho, Tubarão, Orca, Foca, Morsa, Leão-marinho, Peixe, Salmão, Atum, Espadarte, Raia, Polvo, Lula, Choco, Medusa, Estrela-do-mar, Cavalo-marinho, Caranguejo, Lagosta, Camarão, Ostra, Caracol, Lesma, Minhoca, Sanguessuga, Aranha, Tarântula, Escorpião, Abelha, Vespa, Vespão, Mosca, Mosquito, Melga, Borboleta, Traça, Libelinha, Joaninha, Escaravelho, Grilo, Gafanhoto, Barata, Formiga, Térmita, Pulga, Piolho, Carraça
  `),

  profissoes: parseList(`
    Polícia, Ladrão, Detetive, Espião, Juiz, Advogado, Médico, Enfermeiro, Cirurgião, Dentista, Veterinário, Farmacêutico, Cientista, Astronauta, Bombeiro, Soldado, General, Piloto, Hospedeira, Motorista, Taxista, Maquinista, Marinheiro, Capitão, Pirata, Pescador, Agricultor, Jardineiro, Pastor, Lenhador, Mineiro, Ferreiro, Carpinteiro, Canalizador, Eletricista, Pintor, Pedreiro, Arquiteto, Engenheiro, Mecânico, Padeiro, Pasteleiro, Cozinheiro, Chefe, Empregado, Barman, Talhante, Peixeiro, Sapateiro, Alfaiate, Costureira, Cabeleireiro, Barbeiro, Maquilhadora, Modelo, Fotógrafo, Jornalista, Professor, Aluno, Diretor, Bibliotecário, Padre, Freira, Papa, Rei, Rainha, Príncipe, Princesa, Presidente, Político, Ator, Cantor, Músico, Maestro, Bailarino, Palhaço, Mágico, Mimo, Acrobata, Domador, Desportista, Futebolista, Tenista, Nadador, Pugilista, Toureiro, Cowboy, Índio, Ninja, Samurai, Cavaleiro, Viking, Gladiador
  `),

  desportoLazer: parseList(`
    Futebol, Basquetebol, Voleibol, Andebol, Râguebi, Ténis, Badminton, Ping-pong, Golfe, Hóquei, Basebol, Críquete, Futebol Americano, Natação, Polo Aquático, Sincronizada, Mergulho, Surf, Bodyboard, Windsurf, Kitesurf, Vela, Remo, Canoagem, Kayak, Rafting, Pesca, Caça, Tiro, Arco, Esgrima, Boxe, Judo, Karaté, Taekwondo, Luta, Sumo, Capoeira, Atletismo, Maratona, Corrida, Salto, Vara, Peso, Dardo, Disco, Ginástica, Trampolim, Ciclismo, BTT, Motocross, Automobilismo, Karting, Rali, Fórmula 1, Hipismo, Trote, Galope, Skate, Patins, Trotinete, Esqui, Snowboard, Alpinismo, Escalada, Rappel, Slide, Parapente, Pára-quedismo, Bungee-jumping, Yoga, Pilates, Zumba, Ballet, Dança, Tango, Valsa, Salsa, Samba, Folclore, Xadrez, Damas, Cartas, Poker, Dominó, Bilhar, Bowling, Setas, Matraquilhos, Videojogos, Palavras-cruzadas, Sudoku, Puzzles, Legos, Ioiô, Pião, Berlinde, Corda, Elástico, Macaca, Escondidas
  `),

  instrumentosMusicais: parseList(`
    Guitarra, Viola, Baixo, Violino, Violoncelo, Contrabaixo, Harpa, Piano, Teclado, Órgão, Acordeão, Concertina, Flauta, Clarinete, Oboé, Fagote, Saxofone, Trompete, Trombone, Tuba, Trompa, Gaita, Bateria, Tambor, Bombo, Pratos, Pandeireta, Ferrinhos, Maracas, Castanholas, Xilofone, Gongo, Sino, Cavaquinho, Ukulele, Banjo, Bandolim, Alaúde, Sitar, Balalaica, Didgeridoo, Berimbau, Apito, Diapasão, Microfone, Amplificador, Coluna, Auscultadores, Mesa de Mistura, Disco, Vinil, CD, Cassete, Rádio
  `),

  objetosCasa: parseList(`
    Cadeira, Mesa, Banco, Sofá, Poltrona, Puff, Cama, Berço, Beliche, Colchão, Almofada, Lençol, Cobertor, Edredão, Tapete, Carpete, Cortina, Estore, Persiana, Janela, Porta, Chão, Teto, Parede, Telhado, Chaminé, Lareira, Salamandra, Aquecedor, Ventoinha, Ar Condicionado, Candeeiro, Lâmpada, Lanterna, Vela, Isqueiro, Fósforo, Cinzeiro, Vaso, Jarra, Quadro, Espelho, Relógio, Despertador, Telefone, Telemóvel, Carregador, Pilha, Bateria, Tomada, Ficha, Extensão, Computador, Portátil, Tablet, Rato, Teclado, Monitor, Impressora, Router, Televisão, Comando, Box, Consola, DVD, Pen, Disco, Máquina, Aspirador, Vassoura, Pá, Esfregona, Balde, Esponja, Pano, Detergente, Lixívia, Amaciador, Sabão, Ferro, Tábua, Estendal, Mola, Cesto, Lixo, Saco, Caixa, Mala, Mochila, Carteira, Porta-chaves, Chave, Cadeado, Corrente, Corda, Fio, Tesoura, Cola, Fita-cola, Agrafador, Furador, Caneta, Lápis, Borracha, Afia, Régua, Compasso, Caderno, Livro, Revista, Jornal, Carta, Envelope, Selo
  `),

  cozinhaComida: parseList(`
    Garfo, Faca, Colher, Prato, Tigela, Taça, Copo, Caneca, Chávena, Pires, Jarro, Garrafa, Rolha, Saca-rolhas, Abre-latas, Panela, Tacho, Frigideira, Grelhador, Wok, Assadeira, Tabuleiro, Forma, Rolo, Tábua, Ralador, Descascador, Espremedor, Coador, Funil, Concha, Escumadeira, Espátula, Batedeira, Varinha, Torradeira, Tostadeira, Sanduicheira, Microondas, Forno, Fogão, Exaustor, Frigorífico, Congelador, Máquina de loiça, Máquina de café, Chaleira, Balança, Termómetro, Luva, Avental, Pano, Guardanapo, Toalha, Palito, Palhinha, Água, Vinho, Cerveja, Sumo, Leite, Café, Chá, Pão, Torrada, Tosta, Sandes, Bolo, Bolacha, Tarte, Pastel, Croissant, Pizza, Hambúrguer, Cachorro, Batata, Arroz, Massa, Carne, Peixe, Ovo, Queijo, Fiambre, Manteiga, Doce, Mel, Açúcar, Sal, Pimenta, Azeite, Óleo, Vinagre, Limão, Fruta, Legume, Salada, Sopa, Gelado, Chocolate, Bombom, Rebuçado, Pastilha, Pipocas
  `),

  casaBanhoHigiene: parseList(`
    Banheira, Chuveiro, Duche, Torneira, Lavatório, Sanita, Autoclismo, Piaçaba, Bidé, Espelho, Armário, Prateleira, Toalha, Roupão, Chinelo, Tapete, Sabonete, Gel, Champô, Amaciador, Creme, Loção, Óleo, Desodorizante, Perfume, Colónia, Pó, Batom, Rímel, Sombra, Verniz, Laca, Espuma, Cera, Lâmina, Máquina, Tesoura, Pinça, Lima, Corta-unhas, Escova, Pente, Secador, Alisador, Modelador, Papel, Lenço, Algodão, Cotonete, Penso, Tampão, Fralda, Toalhita, Termómetro, Medicamento, Comprimido, Xarope, Pomada, Ligadura, Gesso, Muleta, Cadeira de rodas, Óculos, Lentes, Soro, Aparelho, Placa, Dentadura
  `),

  ferramentasGaragem: parseList(`
    Martelo, Serrote, Serra, Berbequim, Rebarbadora, Lixadora, Plaina, Formão, Lima, Gros, Alicate, Turquesa, Chave, Fenda, Estrela, Inglesa, Boca, Tubo, Sextavada, Allen, Torx, Soquete, Roquete, Macaco, Pregos, Parafusos, Porcas, Anilhas, Buchas, Ganchos, Escápulas, Rebites, Molas, Grampos, Tornus, Prensa, Bigorna, Maçarico, Soldador, Multímetro, Nível, Prumo, Esquadro, Fita, Metro, Paquímetro, Compasso, Lápis, Giz, Marcador, X-ato, Tesoura, Cortante, Desencapador, Pistola, Cola, Silicone, Espuma, Massa, Tinta, Verniz, Diluente, Pincel, Rolo, Trincha, Espátula, Lixa, Escadote, Andaime, Capacete, Luvas, Óculos, Máscara, Botas, Colete, Cone, Triângulo, Extintor, Bomba, Pneu, Roda, Jante, Câmara, Remendo, Corrente, Cadeado, Bicicleta, Mota, Carro, Camião, Trator, Reboque
  `),

  vestuarioAcessorios: parseList(`
    Camisola, T-shirt, Camisa, Blusa, Top, Polo, Casaco, Blusão, Sobretudo, Gabardina, Impermeável, Kispo, Colete, Blazer, Fato, Smoking, Fraque, Calças, Jeans, Calções, Bermudas, Leggings, Saia, Vestido, Túnica, Macacão, Jardineiras, Pijama, Camisa de noite, Roupão, Cuecas, Boxers, Soutien, Meias, Collants, Ligas, Cinto, Suspensórios, Gravata, Laço, Lenço, Cachecol, Echarpe, Xaile, Estola, Luvas, Gorro, Chapéu, Boné, Boina, Cartola, Capacete, Viseira, Fita, Bandolete, Gancho, Elástico, Travessão, Tiara, Coroa, Véu, Máscara, Óculos, Relógio, Brincos, Colar, Pulseira, Tornozeleira, Anel, Aliança, Broche, Alfinete, Botão, Fecho, Atacadores, Sapatos, Ténis, Botas, Botins, Galochas, Sandálias, Chinelos, Pantufas, Socas, Sabrinas, Saltos
  `),

  naturezaElementos: parseList(`
    Sol, Lua, Estrela, Nuvem, Chuva, Neve, Granizo, Vento, Raio, Trovão, Tempestade, Furacão, Tornado, Ciclone, Tsunami, Terramoto, Vulcão, Lava, Cinza, Fumo, Fogo, Água, Terra, Ar, Mar, Oceano, Rio, Lago, Lagoa, Ribeira, Cascata, Catarata, Onda, Espuma, Maré, Praia, Areia, Duna, Rocha, Pedra, Calhau, Montanha, Serra, Colina, Vale, Planície, Deserto, Oásis, Floresta, Mata, Bosque, Selva, Savana, Pantano, Gruta, Caverna, Ilha, Península, Cabo, Baía, Porto, Cais, Farol, Ponte, Estrada, Caminho, Trilho, Árvore, Tronco, Ramo, Folha, Flor, Pétala, Raiz, Semente, Fruto, Erva, Relva, Musgo, Cogumelo, Espinho, Pólen, Néctar
  `),

  personagensFantasia: parseList(`
    Fantasma, Esqueleto, Múmia, Vampiro, Lobisomem, Zombie, Bruxa, Feiticeiro, Mago, Fada, Elfo, Gnomo, Duende, Anão, Gigante, Ogre, Troll, Dragão, Unicórnio, Pégaso, Sereia, Tritão, Monstro, Extraterrestre, Alien, Robô, Cyborg, Super-herói, Vilão, Mutante, Androide, Clone, Fantoche, Marioneta, Boneco, Espantalho, Estátua, Gárgula, Anjo, Demónio, Diabo, Deus, Deusa, Espírito, Alma, Sombra, Reflexo, Gémeo, Sósia
  `),

  sentimentosAbstratos: parseList(`
    Amor, Ódio, Paixão, Ciúme, Inveja, Raiva, Fúria, Medo, Pânico, Terror, Susto, Alegria, Felicidade, Tristeza, Depressão, Saudade, Nostalgia, Esperança, Fé, Crença, Dúvida, Certeza, Confusão, Surpresa, Espanto, Choque, Vergonha, Embaraço, Culpa, Remorso, Orgulho, Vaidade, Arrogância, Humildade, Timidez, Coragem, Cobardia, Preguiça, Tédio, Cansaço, Sono, Fome, Sede, Dor, Prazer, Frio, Calor, Febre, Doença, Saúde, Vida, Morte, Paz, Guerra, Liberdade, Prisão, Justiça, Crime, Castigo, Verdade, Mentira, Segredo, Mistério, Magia, Sonho, Pesadelo, Ideia, Pensamento, Memória, Lembrança, Passado, Presente, Futuro, Tempo, Hora, Minuto, Segundo
  `)
};

export const categoryLabels: Record<keyof typeof mimicaCategories, string> = {
  verbosAcao: '🏃 Verbos de Ação',
  animais: '🦁 Animais',
  profissoes: '👮 Profissões',
  desportoLazer: '⚽ Desporto e Lazer',
  instrumentosMusicais: '🎸 Instrumentos Musicais',
  objetosCasa: '🏠 Objetos de Casa',
  cozinhaComida: '🍳 Cozinha e Comida',
  casaBanhoHigiene: '🛁 Casa de Banho e Higiene',
  ferramentasGaragem: '🛠️ Ferramentas e Garagem',
  vestuarioAcessorios: '👗 Vestuário e Acessórios',
  naturezaElementos: '🌍 Natureza e Elementos',
  personagensFantasia: '👻 Personagens e Fantasia',
  sentimentosAbstratos: '❤️ Sentimentos e Abstratos'
};
