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
- [x] **Dashboard de Métricas:** KPIs de projetos ativos, tarefas concluídas, sprints e membros.
- [x] **Gestão de Projetos:**
  - Tabela com informações de chave, líder, total de tarefas e última atualização.
  - Filtro e busca em tempo real por nome, chave ou responsável.
  - Criação de novo projeto via Modal acessível com foco em UX (geração automática de chave/slug).
  - Gestão de estado reativo com `useState` e imutabilidade.
- [x] **Quadro Kanban:** Visualização do fluxo de trabalho por colunas (*A Fazer*, *Em Andamento*, *Em Revisão*, *Concluído*).
- [x] **Lista de Tarefas:** Organização de tarefas com badges de prioridade coloridos e status.
- [x] **Configurações:** Edição de perfil do workspace e slug da organização.

---

## 🗺️ Roadmap de Evolução

- [ ] **Autenticação e Permissões:** Login, sessões e proteção de rotas com Auth.js / NextAuth.
- [ ] **Banco de Dados Relacional:** Conexão com PostgreSQL via Prisma ORM.
- [ ] **Server Actions & APIs:** Mutações no servidor com validação de esquema (Zod).
- [ ] **Interatividade Kanban:** Drag-and-drop de cartões entre colunas com atualização otimista.
- [ ] **Dark Mode:** Alternância de tema claro/escuro nativo.
- [ ] **Testes Automatizados:** Testes unitários, de componentes e E2E.
- [ ] **Deploy e Produção:** Deploy automatizado e otimizações de SEO / Performance.

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
