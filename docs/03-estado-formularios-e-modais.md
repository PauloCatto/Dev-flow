# Módulo 03: Estado Local, Formulários Controlados e Modais

## 1. O Hook `useState` e Imutabilidade
* **O que é**: O `useState` é o mecanismo primário do React para adicionar memória a um componente funcional.
* **Sintaxe**: `const [state, setState] = useState(initialValue);`
* **Imutabilidade**: Em React, **nunca mutamos o estado diretamente** (como `array.push()`). Sempre retornamos uma nova referência para disparar a re-renderização:
  ```typescript
  // Adiciona item no topo do array sem mutar
  setProjects((prev) => [newProject, ...prev]);
  ```

## 2. Formulários Controlados vs. Two-Way Binding
* **No Angular**: `[(ngModel)]="name"`
* **No React**: Fluxo unidirecional explícito:
  ```tsx
  <input 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
  />
  ```

## 3. Padrão Arquitetural: Server Page + Client Interactive View
* `app/(dashboard)/projects/page.tsx`: Mantido como **Server Component**. Ele busca ou prepara os dados iniciais (`MOCK_PROJECTS`).
* `components/projects/projects-list.tsx`: **Client Component** (`"use client"`). Recebe `initialProjects` via props e assume o controle do estado interativo (abertura de modal, busca e filtro em tempo real, adição dinâmica).
* **Benefício**: Se amanhã substituirmos o mock por um `SELECT` no banco de dados na página do servidor, o componente cliente continua funcionando perfeitamente sem alterações.

## 4. Componentes Criados
* `components/projects/create-project-modal.tsx`: Modal acessível com validação, cálculo de slug automático e fechamento suave.
* `components/projects/projects-list.tsx`: Lista dinâmica com barra de busca em tempo real e orquestração do modal.
