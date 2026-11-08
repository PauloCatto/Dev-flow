# DevFlow 🚀

> **DevFlow** é uma plataforma SaaS moderna de gestão de projetos e produtividade para desenvolvedores e equipes de alta performance. 

Este repositório foi construído com foco em **Clean Architecture**, alta manutenibilidade, tipagem estrita com **TypeScript** e os padrões modernos do **Next.js (App Router)** e **React 19**.

---

## 🛠️ Tecnologias e Ferramentas

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components & Client Components)
* **Biblioteca de UI:** [React 19](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Ícones:** SVG atômicos nativos (Zero dependências adicionais)

---

## 🏛️ Estrutura e Arquitetura do Projeto

O projeto adota o princípio de separação de responsabilidades e co-localização:

```text
devflow/
├── app/                      # Roteamento baseado em arquivos (App Router)
│   ├── (dashboard)/          # Route Group para a área autenticada (App Shell)
│   │   ├── layout.tsx        # Layout mestre (Sidebar + Header + {children})
│   │   ├── dashboard/        # Rota /dashboard (Visão geral, KPIs e projetos)
│   │   ├── projects/         # Rota /projects (Tabela de projetos e busca)
│   │   ├── tasks/            # Rota /tasks (Lista de tarefas por sprint/prioridade)
│   │   ├── kanban/           # Rota /kanban (Quadro ágil por colunas)
│   │   └── settings/         # Rota /settings (Preferências de organização)
│   ├── layout.tsx            # Root Layout (<html> e <body> com fontes Geist)
│   └── page.tsx              # Landing Page de entrada ("/")
├── components/               # Componentes reutilizáveis
│   ├── dashboard/            # Componentes do App Shell (Sidebar, Header, MetricCard)
│   ├── projects/             # Componentes de projetos (ProjectsList, CreateProjectModal)
│   ├── icons.tsx             # Ícones SVG atômicos
│   └── status-badge.tsx      # Badges de versão e status
├── config/
│   └── navigation.ts         # Centralização de rotas e itens do menu
├── types/                    # Contratos de domínio globais (Project, Task, etc.)
├── lib/
│   ├── constants.ts          # Constantes do sistema (Kanban columns, badges)
│   └── mock-data.ts          # Fonte de dados mockados desacoplada
└── docs/                     # Documentação viva de aprendizado e decisões técnicas
```

---

## ⚡ Funcionalidades Implementadas

- [x] **App Shell e Nested Layouts:** Navegação instantânea SPA com preservação de estado da Sidebar via Route Groups `(dashboard)`.
- [x] **Detecção de Rota Ativa:** Destaque dinâmico de link ativo usando o hook `usePathname()` em Client Component.
- [x] **Dashboard de Métricas Dinâmico:** KPIs em tempo real de projetos ativos, tarefas concluídas e progresso calculados com base no estado global.
- [x] **Gestão de Projetos (`/projects` e `/projects/[id]`):**
  - Tabela com informações de chave, líder, total de tarefas e última atualização.
  - Página dedicada de detalhes do projeto (`/projects/[id]`) com KPIs próprios, barra de progresso e lista filtrável de tarefas.
  - Criação e edição completa de projetos via Modal acessível com geração automática de chave/slug.
  - Exclusão de projetos com limpeza em cascata de tarefas vinculadas e sincronização no `localStorage`.
- [x] **Quadro Kanban Interativo (Drag and Drop):**
  - Arraste e solte cartões nativamente (HTML5 Drag and Drop) entre colunas (*A Fazer*, *Em Andamento*, *Em Revisão*, *Concluído*).
  - Destaque visual dinâmico de colunas de destino e animações de soltura.
  - Seletor rápido de coluna diretamente no cartão para acessibilidade em dispositivos móveis e teclado.
  - Filtros instantâneos por projeto (incluindo via query string `?project=`), prioridade e busca por texto.
- [x] **Gestão de Tarefas (`CreateTaskModal` & `/tasks`):**
  - Modal unificado para criar e editar tarefas atribuídas a projetos, com prioridade, responsável e prazos.
  - Lista interativa com marcação de conclusão (checkbox), edição e exclusão.
- [x] **Command Palette Global (`Ctrl+K` / `Cmd+K`):**
  - Modal estilo Spotlight com busca instantânea entre páginas, projetos cadastrados e ações rápidas (criar tarefa, alternar tema).
- [x] **Dark Mode Nativo:**
  - Alternância instantânea entre modo Claro, Escuro e Automático (Sistema).
  - Configuração nativa com `@custom-variant dark` no Tailwind CSS v4 e persistência em `localStorage`.
- [x] **Backend & Banco de Dados Relacional (SQLite + Prisma ORM):**
  - Esquema relacional `Project` e `Task` com `ON DELETE CASCADE` em `prisma/schema.prisma`.
  - Server Actions (`"use server"`) em `app/actions/devflow.ts` com *seed* automático inicial, sincronização de contadores e `revalidatePath`.
  - Atualização otimista (*Optimistic UI*) combinada com persistência SQL no servidor.

---

## 🗺️ Roadmap de Evolução

- [ ] **Autenticação e Permissões:** Login, sessões e proteção de rotas com Auth.js / NextAuth.
- [ ] **Testes Automatizados:** Testes unitários, de componentes e E2E (Vitest / Playwright).
- [ ] **Deploy e Produção:** Deploy automatizado e conexão com banco cloud na Vercel.

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/devflow.git
   cd devflow
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentação Técnica de Aprendizado

Para detalhes aprofundados sobre decisões de arquitetura, comparações técnicas com Angular e conceitos de React/Next.js aplicados, consulte os arquivos em [`/docs`](./docs):
* [`docs/01-fundamentos-e-arquitetura.md`](./docs/01-fundamentos-e-arquitetura.md)
* [`docs/02-app-shell-e-route-groups.md`](./docs/02-app-shell-e-route-groups.md)
* [`docs/03-estado-formularios-e-modais.md`](./docs/03-estado-formularios-e-modais.md)
* [`docs/04-hooks-useeffect-e-command-palette.md`](./docs/04-hooks-useeffect-e-command-palette.md)
* [`docs/05-kanban-drag-and-drop-e-context-api.md`](./docs/05-kanban-drag-and-drop-e-context-api.md)
* [`docs/06-rotas-dinamicas-edicao-e-eslint.md`](./docs/06-rotas-dinamicas-edicao-e-eslint.md)
* [`docs/07-sqlite-prisma-e-server-actions.md`](./docs/07-sqlite-prisma-e-server-actions.md)

