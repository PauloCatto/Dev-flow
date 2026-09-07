import { Task, TaskStatus } from "@/types";

export const KANBAN_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "A Fazer" },
  { id: "in_progress", title: "Em Andamento" },
  { id: "in_review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
];

export const PRIORITY_BADGES: Record<
  Task["priority"],
  { label: string; className: string }
> = {
  urgente: {
    label: "Urgente",
    className:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-900",
  },
  alta: {
    label: "Alta",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  },
  media: {
    label: "Média",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  baixa: {
    label: "Baixa",
    className:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
  },
};
