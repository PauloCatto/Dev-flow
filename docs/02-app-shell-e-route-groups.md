# Módulo 02: App Shell, Route Groups e Nested Layouts

## 1. O Problema Arquitetural em SaaS
Uma aplicação SaaS possui duas experiências visuais distintas:
1. **Área Pública / Marketing**: Sem menu lateral, focada em conversão.
2. **Área Interna da Aplicação (App Shell)**: Sidebar fixa, topbar com busca e contexto de workspace, e área de trabalho dinâmica.

## 2. A Solução do Next.js: Route Groups `(nome)`
Pastas envolvidas por parênteses `(nome)` organizam arquivos em grupos lógicos **sem interferir no caminho da URL**:
* `app/(dashboard)/layout.tsx` provê a casca do App Shell (Sidebar + Header + `{children}`).
* `app/(dashboard)/dashboard/page.tsx` responde na URL `/dashboard`.
* `app/(dashboard)/projects/page.tsx` responde na URL `/projects`.

## 3. Comparação com Angular

| Conceito | Angular | Next.js App Router |
| :--- | :--- | :--- |
| **App Shell** | Componente pai com `<router-outlet>` e array de rotas filhas (`children: [...]`). | `(dashboard)/layout.tsx` recebendo `{children}`. |
| **Navegação SPA** | Diretiva `[routerLink]="'/projects'"` | Componente `<Link href="/projects">` com prefetch automático. |
| **Link Ativo** | Diretiva `routerLinkActive="active"` | Hook `usePathname()` dentro de um Client Component (`"use client"`). |
| **Preservação de Estado** | O Angular preserva o componente pai durante a navegação entre filhas. | O Next.js não remonta o `layout.tsx`, preservando o estado da Sidebar. |

## 4. Onde moram as Interfaces no React vs. Angular?

* **No Angular:** Costuma-se criar arquivos separados para quase tudo (`.model.ts`).
* **No React + TypeScript:**
  1. **Props de Componentes (`interface NomeProps`):** Ficam no **mesmo arquivo do componente**, no topo. Elas são detalhes de implementação estritamente ligados àquele componente específico (ex: `MetricCardProps` em `metric-card.tsx`).
  2. **Modelos de Domínio e Entidades Compartilhadas:** **SIM, devem ter arquivos próprios!** Centralizamos em `types/` (ex: `types/project.ts`, `types/task.ts`, `types/index.ts`). Isso permite que páginas, componentes, APIs e o futuro banco de dados usem o mesmo contrato tipado.

## 5. Rotas do App Shell Implementadas
* `/dashboard`: Métricas, KPIs e projetos recentes.
* `/projects`: Tabela de projetos e chave de identificação.
* `/tasks`: Lista de tarefas por sprint, prioridade e status.
* `/kanban`: Quadro ágil com colunas (A Fazer, Em Andamento, Em Revisão, Concluído).
* `/settings`: Configurações de workspace e slug.

## 6. Principais Aprendizados Técnicos

1. **Route Groups `(pasta)`**:
   * Pastas com parênteses são invisíveis na URL. Permitem isolar layouts diferentes (ex: App Shell vs. Landing Page pública).
2. **Preservação do Layout**:
   * Ao navegar entre `/dashboard`, `/projects` e `/tasks`, o `layout.tsx` **não é remontado**. Apenas o `{children}` muda. A Sidebar não pisca nem perde estado.
3. **Fronteira Server-to-Client**:
   * Um **Server Component** (`layout.tsx`) pode importar e renderizar perfeitamente um **Client Component** (`<Sidebar />`). O Next.js envia o JS apenas da Sidebar para o navegador.
4. **Co-localização de Props vs. Separação de Domínio**:
   * `MetricCardProps` fica junto de `metric-card.tsx` (co-localização, equivalente aos `@Input()` do Angular).
   * `Project` e `Task` ficam isolados em `types/` (entidades de negócio reaproveitáveis em toda a aplicação).
5. **Clean Architecture**:
   * UI separada de constantes (`lib/constants.ts`), navegação (`config/navigation.ts`) e fontes de dados (`lib/mock-data.ts`).

