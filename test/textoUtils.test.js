const TextoUtils = require("../src/textoUtils");

describe("TextoUtils", () => {
  let textoUtils;

  beforeEach(() => {
    textoUtils = new TextoUtils();
  });

  test("deve inverter uma string corretamente", () => {
    expect(textoUtils.inverter("arthur")).toBe("ruhtra");
  });

  test("deve identificar palindromos ignorando caixa e espacos", () => {
    expect(textoUtils.ehPalindromo("A cara rajada da jararaca")).toBe(true);
    expect(textoUtils.ehPalindromo("engenharia")).toBe(false);
  });

  test("deve capitalizar a primeira letra de cada palavra", () => {
    expect(textoUtils.capitalizar("teste de unidade")).toBe("Teste De Unidade");
    // Testa o comportamento com múltiplos espaços e strings vazias (edge cases)
    expect(textoUtils.capitalizar("  ola  mundo  ")).toBe("  Ola  Mundo  ");
  });

  test("deve contar ocorrencias de uma substring", () => {
    expect(textoUtils.contarOcorrencias("banana", "a")).toBe(3);
    expect(textoUtils.contarOcorrencias("banana", "na")).toBe(2);
    // Testa o retorno zero se o alvo for vazio
    expect(textoUtils.contarOcorrencias("banana", "")).toBe(0);
  });

  test("deve remover espacos duplicados e das bordas", () => {
    expect(textoUtils.removerEspacosExtras("   muitos   espacos   ")).toBe("muitos espacos");
  });

  test("deve converter texto para formato slug", () => {
    expect(textoUtils.paraSlug("Olá Mundo, tudo bem?")).toBe("ola-mundo-tudo-bem");
    expect(textoUtils.paraSlug("Apenas-um-teste")).toBe("apenas-um-teste");
  });

  test("deve truncar texto respeitando o tamanho e lancar excecao para negativo", () => {
    expect(textoUtils.truncar("Engenharia de Software", 10)).toBe("Engenharia...");
    // Testa quando o texto já é menor que o limite (não deve adicionar "...")
    expect(textoUtils.truncar("QA", 5)).toBe("QA");
    // Testa a exceção
    expect(() => textoUtils.truncar("Erro", -1)).toThrow("O tamanho não pode ser negativo");
  });

  test("deve contar numero de palavras corretamente", () => {
    expect(textoUtils.contarPalavras("  um   dois  tres ")).toBe(3);
    expect(textoUtils.contarPalavras("   ")).toBe(0);
  });

  test("deve retornar true se contiver apenas letras", () => {
    expect(textoUtils.somenteLetras("Arthur")).toBe(true);
    expect(textoUtils.somenteLetras("Arthur 123")).toBe(false); // Contém números e espaço
    expect(textoUtils.somenteLetras("!@#")).toBe(false); // Contém símbolos
  });

  test("deve substituir todas as ocorrencias e lancar erro se alvo for vazio", () => {
    expect(textoUtils.substituirTudo("o rato roeu a roupa", "r", "p")).toBe("o pato poeu a poupa");
    // Testa a exceção
    expect(() => textoUtils.substituirTudo("teste", "", "a")).toThrow("O alvo não pode ser vazio");
  });
});