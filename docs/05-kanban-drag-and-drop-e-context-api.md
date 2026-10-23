# Módulo 05: Kanban Drag-and-Drop, Context API e Dark Mode Nativo

Neste módulo, o **DevFlow** evoluiu de uma casca de interface estática para uma aplicação interativa com estado global sincronizado entre rotas, movimentação ágil de cartões e suporte nativo a temas.

---

## 1. Context API vs Gerenciamento de Estado

No ecossistema React, quando múltiplos componentes em rotas diferentes precisam ler e alterar os mesmos dados (ex.: adicionar um projeto na página `/projects` e vê-lo refletido no filtro do `/kanban` e no `/dashboard`), o padrão recomendado é a **Context API**.

### Comparação Direta: React vs Angular

| Conceito | Angular | React |
| :--- | :--- | :--- |
| **Estado Compartilhado** | `@Injectable({ providedIn: 'root' })` com `BehaviorSubject` / `Signals`. | `createContext()` e `useContext()`. |
| **Injeção de Dependência** | Construtor da classe: `constructor(private tasksService: TasksService)`. | Custom hook: `const { tasks, addTask } = useDevFlow()`. |
| **Escopo do Provedor** | Módulos (`NgModule`), Providers de componentes ou Root. | Componentes `<Provider value={...}>` envolvendo a árvore JSX no Layout. |
| **Persistência Local** | `localStorage` lido/gravado dentro do Service. | Sincronização em `useEffect` com hidratação segura para SSR. |

---

## 2. Drag and Drop Nativo (HTML5 Drag & Drop API)

Para suportar arrastar e soltar cartões sem inflar o bundle ou introduzir incompatibilidades com o **React 19**, utilizamos a API nativa do navegador:

### Principais Eventos Utilizados:
1. **`draggable` & `onDragStart` (no Cartão):**
   ```tsx
   onDragStart={(e) => {
     e.dataTransfer.setData("text/plain", task.id);
     e.dataTransfer.effectAllowed = "move";
     setDraggedTaskId(task.id);
   }}
   ```
2. **`onDragOver` (na Coluna de Destino):**
   Necessário chamar `e.preventDefault()` para indicar ao navegador que a coluna é uma área de soltura válida (*drop zone*).
3. **`onDrop` (ao Soltar o Cartão):**
   Recupera o `taskId` e executa a atualização de status com atualização imediata de interface (*optimistic update*):
   ```tsx
   const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
     e.preventDefault();
     const taskId = e.dataTransfer.getData("text/plain");
     if (taskId) {
       updateTaskStatus(taskId, columnId);
     }
   };
   ```
4. **Acessibilidade Universal:**
   Nem todos os usuários utilizam mouse (ou estão em dispositivos móveis). Por isso, cada cartão também possui um **seletor rápido de coluna** que permite mover a tarefa via teclado ou toque.

---

## 3. Dark Mode Nativo no Tailwind CSS v4

O Tailwind CSS v4 simplificou a configuração de temas através de variantes customizadas. No arquivo `app/globals.css`:

```css
@import "tailwindcss";

/* Habilita classes dark: quando qualquer elemento ancestral possui a classe .dark */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #f8fafc;
  --foreground: #09090b;
}

.dark {
  --background: #09090b;
  --foreground: #f4f4f5;
}
```

O hook `useDevFlow` controla os modos:
* `"light"`: Remove a classe `.dark` do elemento `<html>`.
* `"dark"`: Adiciona a classe `.dark` ao `<html>`.
* `"system"`: Escuta a preferência do sistema operacional (`prefers-color-scheme: dark`).

---

## 4. Componentes Implementados neste Módulo

* `context/devflow-context.tsx`: Provedor centralizado com sincronização com `localStorage` para projetos, tarefas, contadores e tema.
* `components/kanban/kanban-board.tsx`: Quadro interativo com drag-and-drop, filtros por projeto e prioridade, contadores de coluna e criação rápida.
* `components/tasks/create-task-modal.tsx`: Modal acessível para criação de tarefas vinculadas a projetos.
* `components/tasks/tasks-list.tsx`: Lista dinâmica de tarefas com filtros avançados, marcação de conclusão e remoção.
* `components/dashboard/dashboard-overview.tsx`: Visão geral com KPIs dinâmicos e barras de progresso calculadas em tempo real.
* `app/(dashboard)/settings/page.tsx`: Preferências do workspace e alternador interativo de temas.
