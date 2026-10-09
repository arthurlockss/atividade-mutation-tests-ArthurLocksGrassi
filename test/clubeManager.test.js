const ClubeManager = require("../src/clubeManager");

describe("ClubeManager", () => {
  let clube;

  // Executa antes de cada teste para garantir um estado limpo
  beforeEach(() => {
    clube = new ClubeManager("Flamengo", 10000000, "Maracanã");
  });

  test("1. deve contratar um novo jogador com dados válidos", () => {
    // Act
    clube.contratarJogador("Arrascaeta", "Meio-campo", 500000);

    // Assert
    expect(clube.jogadores.length).toBe(1);
    expect(clube.jogadores[0].nome).toBe("Arrascaeta");
    expect(clube.jogadores[0].titular).toBe(false);
  });

  test("1.1. deve lançar erro ao contratar jogador com dados inválidos", () => {
    // Act & Assert
    expect(() => clube.contratarJogador("", "Atacante", 100000)).toThrow("Dados do jogador inválidos");
    expect(() => clube.contratarJogador("Pedro", "", 100000)).toThrow("Dados do jogador inválidos");
    expect(() => clube.contratarJogador("Pedro", "Atacante", -50)).toThrow("Dados do jogador inválidos");
  });

  test("2. deve vender um jogador e adicionar valor ao orçamento", () => {
    // Arrange
    clube.contratarJogador("Everton", "Atacante", 300000);
    const orcamentoInicial = clube.orcamento;

    // Act
    clube.venderJogador("Everton", 2000000);

    // Assert
    expect(clube.jogadores.length).toBe(0);
    expect(clube.orcamento).toBe(orcamentoInicial + 2000000);
  });

  test("3. deve receber patrocínio e aumentar o orçamento", () => {
    // Arrange
    const orcamentoInicial = clube.orcamento;

    // Act
    clube.receberPatrocinio(5000000);

    // Assert
    expect(clube.orcamento).toBe(orcamentoInicial + 5000000);
  });

  test("4. deve calcular a folha salarial corretamente", () => {
    // Arrange
    clube.contratarJogador("Gerson", "Meio-campo", 400000);
    clube.contratarJogador("Léo Pereira", "Zagueiro", 200000);

    // Act
    const folha = clube.calcularFolhaSalarial();

    // Assert
    expect(folha).toBe(600000);
  });

  test("5. deve pagar salários e deduzir do orçamento", () => {
    // Arrange
    clube.contratarJogador("Rossi", "Goleiro", 300000);
    const orcamentoInicial = clube.orcamento;

    // Act
    clube.pagarSalarios();

    // Assert
    expect(clube.orcamento).toBe(orcamentoInicial - 300000);
  });

  test("5.1. deve lançar erro ao tentar pagar salários sem orçamento suficiente", () => {
    // Arrange
    clube.orcamento = 100000;
    clube.contratarJogador("Jogador Caro", "Atacante", 500000);

    // Act & Assert
    expect(() => clube.pagarSalarios()).toThrow("Orçamento insuficiente para pagar salários");
  });

  test("6. deve registrar resultados e calcular pontos", () => {
    // Act
    clube.registrarResultado("V"); // +3
    clube.registrarResultado("E"); // +1
    clube.registrarResultado("D"); // +0

    // Assert
    expect(clube.estatisticas.partidasJogadas).toBe(3);
    expect(clube.estatisticas.pontos).toBe(4);
    expect(clube.estatisticas.vitorias).toBe(1);
  });

  test("7. deve calcular aproveitamento de pontos", () => {
    // Arrange
    clube.registrarResultado("V");
    clube.registrarResultado("E");
    // 4 pontos de 6 possíveis = 66.67%

    // Act
    const aproveitamento = clube.calcularAproveitamento();

    // Assert
    expect(aproveitamento).toBe(66.67);
  });

  test("8. deve adicionar gol a um jogador", () => {
    // Arrange
    clube.contratarJogador("Gabriel Barbosa", "Atacante", 800000);

    // Act
    clube.adicionarGol("Gabriel Barbosa");

    // Assert
    expect(clube.jogadores[0].gols).toBe(1);
  });

  test("9. deve obter o artilheiro do time", () => {
    // Arrange
    clube.contratarJogador("Bruno Henrique", "Atacante", 600000);
    clube.contratarJogador("Arrascaeta", "Meio-campo", 700000);
    
    clube.adicionarGol("Bruno Henrique");
    clube.adicionarGol("Bruno Henrique");
    clube.adicionarGol("Arrascaeta");

    // Act
    const artilheiro = clube.obterArtilheiro();

    // Assert
    expect(artilheiro.nome).toBe("Bruno Henrique");
    expect(artilheiro.gols).toBe(2);
  });

  test("10. deve buscar jogadores por posição", () => {
    // Arrange
    clube.contratarJogador("Ayrton Lucas", "Lateral", 300000);
    clube.contratarJogador("Varela", "Lateral", 250000);
    clube.contratarJogador("Pulgar", "Meio-campo", 400000);

    // Act
    const laterais = clube.buscarJogadoresPorPosicao("Lateral");

    // Assert
    expect(laterais.length).toBe(2);
    expect(laterais[0].nome).toBe("Ayrton Lucas");
  });

  test("11 e 12. deve promover e rebaixar jogador do time titular", () => {
    // Arrange
    clube.contratarJogador("Matheus", "Goleiro", 100000);

    // Act (Promove)
    clube.promoverAoTimeTitular("Matheus");
    expect(clube.jogadores[0].titular).toBe(true);

    // Act (Rebaixa)
    clube.rebaixarAoTimeReserva("Matheus");
    expect(clube.jogadores[0].titular).toBe(false);
  });

  test("13 e 14. deve aplicar desgaste apenas aos titulares e depois recuperar energia", () => {
    // Arrange
    clube.contratarJogador("Titular", "Zagueiro", 100000);
    clube.contratarJogador("Reserva", "Zagueiro", 100000);
    clube.promoverAoTimeTitular("Titular");

    // Act (Desgasta)
    clube.aplicarDesgasteFisico(30);

    // Assert Desgaste
    expect(clube.buscarJogador("Titular").energia).toBe(70);
    expect(clube.buscarJogador("Reserva").energia).toBe(100);

    // Act (Recupera)
    clube.recuperarEnergia(20);

    // Assert Recuperação
    expect(clube.buscarJogador("Titular").energia).toBe(90);
    expect(clube.buscarJogador("Reserva").energia).toBe(100); // Max 100
  });

  test("15 e 16. deve afastar por lesão e diminuir tempo de lesão progressivamente", () => {
    // Arrange
    clube.contratarJogador("De La Cruz", "Meio-campo", 600000);
    clube.promoverAoTimeTitular("De La Cruz");

    // Act (Lesão)
    clube.afastarPorLesao("De La Cruz", 2);

    // Assert Lesão
    const jogador = clube.buscarJogador("De La Cruz");
    expect(jogador.jogosLesionado).toBe(2);
    expect(jogador.titular).toBe(false);

    // Act (Recuperação progressiva)
    clube.diminuirTempoLesao();
    expect(jogador.jogosLesionado).toBe(1);
    
    clube.diminuirTempoLesao();
    expect(jogador.jogosLesionado).toBe(0);
  });

  test("17. deve listar apenas jogadores disponíveis (sem lesão e com energia > min)", () => {
    // Arrange
    clube.contratarJogador("Pronto", "Zagueiro", 100000); // 100 energia
    
    clube.contratarJogador("Cansado", "Volante", 100000);
    clube.promoverAoTimeTitular("Cansado");
    clube.aplicarDesgasteFisico(60); // Fica com 40 energia
    
    clube.contratarJogador("Lesionado", "Atacante", 100000);
    clube.afastarPorLesao("Lesionado", 1);

    // Act
    const disponiveis = clube.listarJogadoresDisponiveis(50);

    // Assert
    expect(disponiveis.length).toBe(1);
    expect(disponiveis[0].nome).toBe("Pronto");
  });

  test("18. deve calcular a média de gols do time", () => {
    // Arrange
    clube.contratarJogador("Atacante 1", "Atacante", 100000);
    clube.registrarResultado("V"); // Jogo 1
    clube.registrarResultado("V"); // Jogo 2
    
    clube.adicionarGol("Atacante 1");
    clube.adicionarGol("Atacante 1");
    clube.adicionarGol("Atacante 1"); // 3 gols em 2 jogos

    // Act
    const media = clube.calcularMediaGolsTime();

    // Assert
    expect(media).toBe(1.5);
  });

  test("19. deve alterar o nome do estádio validando strings vazias", () => {
    // Act
    clube.alterarEstadio("Novo Naming Rights Arena");

    // Assert
    expect(clube.estadio).toBe("Novo Naming Rights Arena");
    expect(() => clube.alterarEstadio("   ")).toThrow("O nome do estádio não pode ser vazio");
  });

  test("20. deve gerar relatório geral formatado", () => {
    // Arrange
    clube.contratarJogador("Artilheiro", "Atacante", 100000);
    clube.adicionarGol("Artilheiro");
    clube.registrarResultado("V");

    // Act
    const relatorio = clube.gerarRelatorioGeral();

    // Assert
    expect(relatorio.clube).toBe("Flamengo");
    expect(relatorio.aproveitamento).toBe("100%");
    expect(relatorio.artilheiro).toBe("Artilheiro");
    expect(relatorio.elencoTotal).toBe(1);
  });
});