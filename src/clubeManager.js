class ClubeManager {
  constructor(nomeClube, orcamentoInicial = 1000000, estadio = "Maracanã") {
    this.nomeClube = nomeClube;
    this.orcamento = orcamentoInicial;
    this.estadio = estadio;
    this.jogadores = [];
    this.estatisticas = {
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      pontos: 0,
      partidasJogadas: 0,
    };
  }

  // 1. Contrata um novo jogador validando dados básicos
  contratarJogador(nome, posicao, salario) {
    if (!nome || !posicao || salario <= 0) {
      throw new Error("Dados do jogador inválidos");
    }
    this.jogadores.push({
      nome,
      posicao,
      salario,
      gols: 0,
      energia: 100,
      titular: false,
      jogosLesionado: 0,
    });
  }

  // 2. Vende um jogador e adiciona o valor ao orçamento
  venderJogador(nome, valorVenda) {
    const index = this.jogadores.findIndex((j) => j.nome === nome);
    if (index === -1) throw new Error("Jogador não encontrado");
    
    this.jogadores.splice(index, 1);
    this.orcamento += valorVenda;
  }

  // 3. Incrementa o orçamento do clube
  receberPatrocinio(valor) {
    if (valor <= 0) throw new Error("O patrocínio deve ser maior que zero");
    this.orcamento += valor;
  }

  // 4. Calcula o total gasto com salários mensalmente
  calcularFolhaSalarial() {
    return this.jogadores.reduce((total, jogador) => total + jogador.salario, 0);
  }

  // 5. Deduz a folha salarial do orçamento
  pagarSalarios() {
    const folha = this.calcularFolhaSalarial();
    if (this.orcamento < folha) {
      throw new Error("Orçamento insuficiente para pagar salários");
    }
    this.orcamento -= folha;
    return this.orcamento;
  }

  // 6. Atualiza estatísticas do clube após uma partida
  registrarResultado(resultado) {
    this.estatisticas.partidasJogadas += 1;
    if (resultado === "V") {
      this.estatisticas.vitorias += 1;
      this.estatisticas.pontos += 3;
    } else if (resultado === "E") {
      this.estatisticas.empates += 1;
      this.estatisticas.pontos += 1;
    } else if (resultado === "D") {
      this.estatisticas.derrotas += 1;
    } else {
      throw new Error("Resultado inválido. Use 'V', 'E' ou 'D'");
    }
  }

  // 7. Calcula o percentual de aproveitamento dos pontos
  calcularAproveitamento() {
    if (this.estatisticas.partidasJogadas === 0) return 0;
    const pontosPossiveis = this.estatisticas.partidasJogadas * 3;
    return Number.parseFloat(((this.estatisticas.pontos / pontosPossiveis) * 100).toFixed(2));
  }

  // 8. Atribui um gol a um jogador específico
  adicionarGol(nomeJogador) {
    const jogador = this.buscarJogador(nomeJogador);
    jogador.gols += 1;
  }

  // 9. Retorna o jogador com mais gols
  obterArtilheiro() {
    if (this.jogadores.length === 0) return null;
    return this.jogadores.reduce((artilheiro, jogador) => 
      jogador.gols > artilheiro.gols ? jogador : artilheiro,
      this.jogadores[0] 
    );
  }

  // 10. Filtra jogadores por posição (ex: "Atacante", "Goleiro")
  buscarJogadoresPorPosicao(posicao) {
    return this.jogadores.filter((j) => j.posicao === posicao);
  }

  // 11. Promove um jogador a titular
  promoverAoTimeTitular(nome) {
    const jogador = this.buscarJogador(nome);
    jogador.titular = true;
  }

  // 12. Move um jogador para o banco de reservas
  rebaixarAoTimeReserva(nome) {
    const jogador = this.buscarJogador(nome);
    jogador.titular = false;
  }

  // 13. Reduz a energia (stamina) dos jogadores que entraram em campo
  aplicarDesgasteFisico(percentualDesgaste) {
    this.jogadores.forEach((jogador) => {
      if (jogador.titular) {
        jogador.energia = Math.max(0, jogador.energia - percentualDesgaste);
      }
    });
  }

  // 14. Recupera a energia de todos os jogadores após descanso/treino regenerativo
  recuperarEnergia(quantidade) {
    this.jogadores.forEach((jogador) => {
      jogador.energia = Math.min(100, jogador.energia + quantidade);
    });
  }

  // 15. Marca um jogador como lesionado por um número X de jogos
  afastarPorLesao(nome, partidas) {
    const jogador = this.buscarJogador(nome);
    jogador.jogosLesionado = partidas;
    jogador.titular = false; // Perde a titularidade automaticamente
  }

  // 16. Reduz o contador de lesão de todos os jogadores (chamado após cada jogo)
  diminuirTempoLesao() {
    this.jogadores.forEach((jogador) => {
      if (jogador.jogosLesionado > 0) {
        jogador.jogosLesionado -= 1;
      }
    });
  }

  // 17. Retorna jogadores que não estão lesionados e têm energia suficiente
  listarJogadoresDisponiveis(energiaMinima = 50) {
    return this.jogadores.filter(
      (j) => j.jogosLesionado === 0 && j.energia >= energiaMinima
    );
  }

  // 18. Calcula a média de gols marcados pelo time por partida
  calcularMediaGolsTime() {
    if (this.estatisticas.partidasJogadas === 0) return 0;
    const totalGols = this.jogadores.reduce((total, j) => total + j.gols, 0);
    return Number.parseFloat((totalGols / this.estatisticas.partidasJogadas).toFixed(2));
  }

  // 19. Altera o nome do estádio caso a diretoria feche um naming rights
  alterarEstadio(novoNome) {
    if (!novoNome || novoNome.trim() === "") {
      throw new Error("O nome do estádio não pode ser vazio");
    }
    this.estadio = novoNome;
  }

  // 20. Gera um objeto de log completo da situação do clube
  gerarRelatorioGeral() {
    return {
      clube: this.nomeClube,
      orcamento: this.orcamento,
      elencoTotal: this.jogadores.length,
      aproveitamento: `${this.calcularAproveitamento()}%`,
      artilheiro: this.obterArtilheiro()?.nome || "Nenhum",
    };
  }

  // Método auxiliar privado
  buscarJogador(nome) {
    const jogador = this.jogadores.find((j) => j.nome === nome);
    if (!jogador) throw new Error(`Jogador ${nome} não encontrado`);
    return jogador;
  }
}

module.exports = ClubeManager;