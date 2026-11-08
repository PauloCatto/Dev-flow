# Módulo 07: Backend Full-Stack com SQLite, Prisma ORM e Server Actions

Neste módulo, o **DevFlow** passou a persistir projetos e tarefas em um banco de dados relacional **SQLite** real (`prisma/dev.db`) gerenciado pelo **Prisma ORM**, utilizando **Server Actions** do Next.js 16 com **Optimistic UI**.

---

## 1. Arquitetura do Banco de Dados (`prisma/schema.prisma`)

O esquema relacional define duas tabelas principais com integridade referencial (`onDelete: Cascade`):

* **`Project`**: Armazena metadados do projeto (`id`, `name`, `key`, `lead`, `status`, `tasksCount`, `completedTasks`).
* **`Task`**: Armazena as tarefas vinculadas a um projeto (`projectId` como chave estrangeira).

---

## 2. Server Actions vs API REST Tradicional

No Next.js App Router, funções assíncronas marcadas com `"use server"` em `app/actions/devflow.ts` são executadas exclusivamente no servidor Node.js e invocadas pelo cliente como chamadas RPC tipadas (via `POST` automático).

### Fluxo Híbrido (Optimistic UI + Persistência SQL):
1. **Hidratação no Servidor (`app/(dashboard)/layout.tsx`):**
   O Server Component busca os projetos e tarefas diretamente no SQLite (`getInitialWorkspaceData()`) — e faz o *seed* automático caso o banco esteja vazio na primeira execução.
2. **Atualização Instantânea + Gravação Assíncrona (`context/devflow-context.tsx`):**
   Quando o usuário cria, edita, conclui ou arrasta um cartão no Kanban, a interface atualiza no mesmo milissegundo e dispara a Server Action (`createTaskAction`, `updateTaskStatusAction`, etc.) que persiste no SQLite e executa `revalidatePath()`.

---

## 3. Comandos Úteis do Banco de Dados

* `npx prisma db push`: Cria/atualiza as tabelas no arquivo `prisma/dev.db`.
* `npx prisma studio`: Abre uma interface visual no navegador para inspecionar e editar as tabelas do SQLite em tempo real.

