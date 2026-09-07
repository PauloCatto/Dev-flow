# Módulo 04: O Hook `useEffect`, Efeitos Colaterais e o Command Palette (`Ctrl+K`)

## 1. O que é o Hook `useEffect`?
No React, componentes funcionais devem ser o mais próximos de funções puras possível (recebem props e retornam JSX). 
Qualquer operação que interaja com o mundo exterior (fora do React) é um **Efeito Colateral** (*Side Effect*):
* Escutar eventos no objeto global `window` (como teclas de atalho);
* Fazer chamadas de rede manuais (`fetch`);
* Iniciar temporizadores (`setInterval`, `setTimeout`).

### A Sintaxe e a Função de Limpeza (Cleanup):
```tsx
useEffect(() => {
  // 1. Executa quando o componente monta
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); // Impede o navegador de focar no Google
      setIsOpen((prev) => !prev);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  // 2. FUNÇÃO DE LIMPEZA (executa quando o componente desmonta)
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []); // <- Array de dependências vazio: roda apenas no ciclo de montagem/desmontagem
```

---

## 2. Comparação Direta com Angular

| Conceito | Angular | React |
| :--- | :--- | :--- |
| **Ouvir teclas globais** | Decorator `@HostListener('window:keydown', ['$event'])` na classe. | Hook `useEffect` registrando listener no `window`. |
| **Limpeza de Eventos** | Gerenciada internamente pelo Angular ou `ngOnDestroy()`. | Retornar uma função dentro do `useEffect`: `return () => cleanup()`. |
| **Prevenção de Atalho** | `event.preventDefault()` dentro do método do listener. | `e.preventDefault()` dentro da função do efeito. |

---

## 3. Componentes Implementados
* `components/dashboard/command-palette.tsx`: Modal estilo Spotlight com busca global rápida entre páginas e projetos, fechamento com `Escape` e navegação via `useRouter()`.
* `components/dashboard/header.tsx`: Integrado com gatilho visual e captura global do atalho `Ctrl+K` / `Cmd+K`.
