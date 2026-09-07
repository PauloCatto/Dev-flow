# Módulo 01: Fundamentos e Arquitetura (React 19 + Next.js App Router)

## 1. Visão Geral e Comparação com Angular

| Conceito | Angular | React + Next.js (App Router) |
| :--- | :--- | :--- |
| **Paradigma** | Framework opinativo orientado a classes, decorators (`@Component`) e injeção de dependência. | React é uma biblioteca declarativa de UI baseada em funções. Next.js é o framework de produção. |
| **Templates** | HTML com sintaxe proprietária (`*ngIf`, `*ngFor`, `{{ }}`, `@if`, `@for`). | **JSX** (JavaScript XML): HTML diretamente dentro de funções JS/TS normais. |
| **Roteamento** | Configuração imperativa em arrays de rotas (`routes.ts`) + `<router-outlet />`. | **File-system routing**: Pastas definem caminhos na URL; arquivos especiais (`page.tsx`, `layout.tsx`). |
| **Layouts** | Componentes pai com `<router-outlet />`. | `layout.tsx` recebendo `{ children }` via props. |
| **Onde o código roda** | Historicamente Client-side SPA (com SSR opcional via Angular Universal/SSR). | **Server Components por padrão**: executam no servidor, zero bundle JS no cliente. |
| **Interatividade** | Qualquer componente ou diretiva lida com eventos do DOM (`(click)`). | Apenas componentes marcados com `"use client"` possuem interatividade e estado no navegador. |

---

## 2. Estrutura de Arquivos Inicial

* `app/`: Diretório base do **App Router**.
  * `app/layout.tsx`: Root Layout obrigatório da aplicação (engloba `<html>` e `<body>`).
  * `app/page.tsx`: Página principal associada à rota raiz (`/`).
  * `app/globals.css`: Folha de estilo global com Tailwind CSS v4.
  * `app/favicon.ico`: Ícone da aplicação.
* `public/`: Arquivos estáticos servidos diretamente na raiz (ex: `/next.svg`).
* `next.config.ts`: Configurações do compilador e do runtime do Next.js.
* `tsconfig.json`: Configuração do compilador TypeScript com alias de importação (`@/*`).
* `postcss.config.mjs`: Configuração do processador de CSS (Tailwind).
* `package.json`: Manifesto de dependências (`next: 16.3.4`, `react: 19.2.8`).

---

## 3. Conceitos Centrais

### React vs. Next.js
* **React**: Biblioteca de construção de interfaces de usuário. Fornece a sintaxe JSX, modelo mental de componentes, estado (`useState`) e ciclo de vida/efeitos (`useEffect`).
* **Next.js**: Framework fullstack construído em cima do React. Fornece roteamento, otimização de imagens/fontes, compilação híbrida (Server Components, SSR, SSG), Server Actions, Route Handlers (APIs) e bundling.

### Server Components vs. Client Components
1. **Server Components (Padrão no App Router):**
   * Executam **apenas no servidor** durante a requisição ou no build.
   * Podem acessar banco de dados, variáveis de ambiente secretas e sistema de arquivos diretamente sem expor APIs.
   * Não enviam JavaScript para o bundle do navegador.
   * **Restrições**: Não podem usar hooks de estado do navegador (`useState`, `useEffect`) nem manipuladores de eventos do DOM (`onClick`, `onChange`).

2. **Client Components:**
   * Declarados explicitamente adicionando a diretiva `"use client";` na primeira linha do arquivo.
   * São renderizados inicialmente no servidor (SSR para gerar HTML rápido) e depois **hidratados** no navegador com JavaScript.
   * Podem usar estado local (`useState`), efeitos (`useEffect`), APIs de browser (`localStorage`, `window`) e eventos de clique/digitação.

### Componentização e Props
* Componentes no React são funções que retornam JSX.
* As entradas de dados (**Props**) equivalem ao `@Input()` do Angular.
* São tipadas com `interface NomeProps { ... }` e desestruturadas nos argumentos: `function Componente({ propA, propB }: NomeProps)`.
* **Path Aliases (`@/*`)**: Configurado no `tsconfig.json`, permite importar `@/components/...` sem caminhos relativos frágeis (`../../`).

---

## 4. Desafios e Próximos Passos
* [x] Exercício 01: Compreensão dos fundamentos e do modelo Server vs. Client (concluído com sucesso!).
* [x] Limpeza do boilerplate e criação da página inicial do DevFlow em `app/page.tsx`.
* [x] Exercício 02: Criando nosso primeiro componente reutilizável com Props tipadas em TypeScript (`components/status-badge.tsx`).
* [ ] Exercício 03: Props opcionais, valores padrão e a prop especial `children`.
* [ ] Próximo módulo: Decomposição de componentes, JSX avançado e Props/Children.
