# 🏦 Educa.bolsa (Educador Financeiro Inteligente)

![Vitest](https://img.shields.io/badge/Vitest-Test_Coverage-10b981?style=for-the-badge&logo=vitest)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-FFD700?style=for-the-badge&logo=google)

Este repositório contém a proposta de solução para o desafio de criação de um assistente virtual (baseado no "Planej.ai"), porém totalmente reconstruído e focado em um nicho específico: **educação financeira e controle de gastos para o público da terceira idade**. 

Batizado carinhosamente de **"Educa.bolsa"**, o sistema ajuda a pessoa usuária a controlar sua aposentadoria de forma acolhedora, com interface ultra limpa e fácil de navegar.

---

## 🎯 O que o projeto faz?

O **Educa.bolsa** é uma aplicação web interativa que:
1. Coleta dados da saúde financeira da pessoa (renda, gastos essenciais, dívidas com consignado, gastos extras, dinheiro guardado e o próximo sonho).
2. Envia esses dados estruturados para a Inteligência Artificial do Google Gemini.
3. Processa o retorno da IA e exibe um **Diagnóstico de Saúde Financeira** de 0 a 100, junto com um plano de economia passo a passo para alcançar o "Pote dos Sonhos".

Tudo isso com uma comunicação simples, clara e amigável, sem jargões financeiros, ideal para idosos.

---

## 🚀 Como executar a aplicação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/johnaopedro/Educa.veio.git
   cd Educa.veio
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a chave da API do Gemini:**
   Crie um arquivo `.env` na raiz do projeto e insira sua chave da Google AI Studio:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   ```
   *(Nota: Caso você não tenha a chave, a aplicação rodará usando um algoritmo interno de fallback com dados simulados para não quebrar a interface!)*

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação abrirá em `http://localhost:5173`.

---

## 🛠 Quais tecnologias foram usadas?

- **Frontend Core:** React 19, TypeScript, Vite
- **Estilização e UI:** Tailwind CSS v3 (Customizado com "Soft UI" e tokens Premium), Lucide React (Ícones)
- **Roteamento e Estado:** React Router DOM, Custom Hook para LocalStorage
- **Inteligência Artificial:** `@google/generative-ai` (Modelo *gemini-1.5-flash*)
- **Infraestrutura de Testes e Qualidade (O Diferencial):**
  - **Vitest & React Testing Library:** Testes unitários e de componente.
  - **Playwright:** Testes End-to-End (E2E).
  - **ESLint & SonarJS:** Garantia de código limpo (Complexidade Cognitiva < 15).
  - **Dependency-Cruiser:** Cerca arquitetural para garantir a coesão (SOLID/GRASP).
  - **JSCPD:** Análise automática de clones de código (DRY).

---

## 🌟 Qual melhoria você implementou? (Diferenciais do Projeto Base)

Além de replicar o fluxo principal do Planej.ai, decidi evoluir o projeto implementando **todos** os desafios extras propostos pelo curso e mais alguns diferenciais para demonstrar senioridade:

1. **Página de Histórico e Chat com a IA (Desafios do Repositório):** Criei uma tela de histórico (`/historico`) onde a pessoa usuária pode revisitar simulações passadas. Além disso, implementei o Chat Inteligente, permitindo uma conversa interativa com o Educador Financeiro sobre qualquer simulação anterior.
2. **Público-Alvo Específico (Idosos):** O fluxo de perguntas (7 passos) foi pensado para quem recebe aposentadoria e pensão, focando em dívidas de empréstimo consignado. A interface usa fontes gigantes e alto contraste (Branco e Azul Premium) para máxima acessibilidade.
3. **Engenharia de Prompt Avançada:** O Gemini não retorna texto livre, ele retorna um objeto JSON estrito com `healthScore`, alertas de dívida separados do diagnóstico geral, e um plano de economia. 
4. **Infraestrutura de Qualidade "À Prova de Balas":** Adicionei uma esteira de testes automatizados e análise estática (SonarJS, Playwright, Vitest), que eleva a aplicação de um simples "Desafio/MVP" para um software padrão enterprise.

---

## 🧪 Como testar o fluxo principal e a qualidade

**Testar a interface como usuário:**
- Abra a aplicação via `npm run dev`.
- Clique em "Começar Agora" e preencha os 7 passos.
- Na última tela, visualize os gráficos e as dicas da Inteligência Artificial.
- Troque o tema (Light/Dark) clicando na lua/sol no topo para testar a persistência.

**Rodar a Esteira de Qualidade (Terminal):**
- Testes Unitários: `npm run test`
- Cobertura de Testes: `npm run test:coverage`
- Análise de Acoplamento (Solid): `npm run depcruise`
- Testes de Fluxo E2E: `npm run test:e2e` (Requer `npx playwright install` antes)
- Validador SonarJS: `npm run lint:sonar`

---

## 🧠 O que você aprendeu durante o desafio?

Este desafio foi incrível para solidificar o conceito de que o **Front-End moderno não é apenas sobre desenhar telas**.
Ao integrar o Google Gemini, aprendi a estruturar Prompts defensivos que forçam a IA a cuspir um JSON formatado, garantindo que o React possa parsear e injetar esses dados em componentes visuais (como o Termômetro de Saúde e o Alerta Vermelho de Dívidas). 

Também pude exercitar minhas habilidades de **Arquitetura de Software**, montando um ambiente de desenvolvimento robusto com linters, checagens de acoplamento e testes automatizados, provando que um projeto de portfólio pode (e deve) ter a mesma qualidade de um produto real em produção.
