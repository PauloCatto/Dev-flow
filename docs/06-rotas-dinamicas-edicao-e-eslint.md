# Módulo 06: Rotas Dinâmicas (`/projects/[id]`), Edição Completa e Regra Customizada no ESLint

Neste módulo, fechamos o ciclo completo de CRUD no Frontend (Create, Read, Update, Delete) para Projetos e Tarefas, adicionamos roteamento dinâmico no Next.js 16 e criamos um plugin customizado no ESLint v9 (Flat Config) para proibir e remover comentários automaticamente.

---

## 1. Rotas Dinâmicas no Next.js 16 (`/projects/[id]`)

No App Router do Next.js (versões 15 e 16), pastas envolvidas por colchetes como `app/(dashboard)/projects/[id]/page.tsx` criam segmentos dinâmicos de URL.

### Mudança Importante no Next.js 15/16: `params` Assíncrono
Diferente de versões antigas onde `params` era um objeto síncrono, no Next.js 16 `params` é uma **`Promise`**:

```tsx
import { ProjectDetails } from "@/components/projects/project-details";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetails projectId={id} />;
}
```

### Comparação Direta: Angular vs Next.js
| Conceito | Angular | Next.js (App Router) |
| :--- | :--- | :--- |
| **Definição da Rota** | `{ path: 'projects/:id', component: ProjectDetailsComponent }` | Pasta `app/(dashboard)/projects/[id]/page.tsx` |
| **Leitura do Parâmetro** | `this.route.paramMap.subscribe(p => p.get('id'))` ou `input()` com `withComponentInputBinding()` | `const { id } = await params` (Server Component) ou `useParams()` (Client Component) |

---

## 2. Ciclo CRUD Completo e Sincronização de Contadores

No arquivo `context/devflow-context.tsx`, aprimoramos o estado centralizado para garantir consistência total com o `localStorage`:
* **`updateProject` e `updateTask`**: Permitem editar qualquer projeto ou tarefa existente reutilizando os modais `CreateProjectModal` e `CreateTaskModal` em modo de edição.
* **Recálculo Automático de Métricas**: Ao mover uma tarefa de projeto, alterar seu status para `"done"` (via Kanban, Select ou Checkbox) ou excluir um projeto, os contadores `tasksCount` e `completedTasks` são recalculados e persistidos imediatamente no `localStorage`.

---

## 3. Regra Customizada no ESLint v9 (`custom/no-comments`)

O ESLint v9 utiliza o formato **Flat Config** (`eslint.config.mjs`). Criamos uma regra autofixável (`fixable: "code"`) que inspeciona todos os nós de comentário da AST (`sourceCode.getAllComments()`) e remove tanto comentários JS/TS (`//` e `/* */`) quanto blocos de comentário JSX (`{/* */}`) ao rodar `npm run lint:fix`.

