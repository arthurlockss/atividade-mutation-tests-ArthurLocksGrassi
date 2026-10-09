# Mutation Tests com Stryker Mutator

## GitHub Actions

[![Build, Tests and Mutation Tests](https://github.com/ArthurLocksGrassi/mutation-tests-stryker/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/ArthurLocksGrassi/mutation-tests-stryker/actions/workflows/node.js.yml)

## Sobre o Projeto

Este projeto é baseado no trabalho de **testes unitários com Jest** e estendido com a técnica de **Mutation Testing** utilizando a ferramenta [Stryker Mutator](https://stryker-mutator.io/).

O **Mutation Testing** consiste em introduzir pequenas mutações (alterações) no código fonte e verificar se os testes existentes conseguem detectar essas mudanças. Com isso, é possível medir a **qualidade dos testes** e não apenas a cobertura de linhas.

## Ferramentas Utilizadas

- **[Jest](https://jestjs.io/)** — framework de testes unitários
- **[Stryker Mutator](https://stryker-mutator.io/)** — ferramenta de mutation testing para JavaScript

## Getting Started

Para executar o projeto, siga os passos abaixo:

1. Instale o [Node.js](https://nodejs.org/) (versão >= 20.x)
2. Execute `npm install` para instalar todas as dependências
3. Execute `npm test` para rodar a suíte de testes
4. Execute `npm run coverage` para rodar os testes com relatório de cobertura
5. Execute `npm run mutate` para rodar os **mutation tests** com o Stryker

O relatório HTML gerado pelo Stryker pode ser encontrado em `./reports/mutation/`.

## Estrutura do Projeto

- `src/` — código-fonte
- `test/` — arquivos de testes unitários
- `stryker.config.js` — configuração do Stryker Mutator
- `.github/workflows/` — pipeline de CI/CD com GitHub Actions