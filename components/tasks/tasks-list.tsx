"use client";

import { useState, useTransition } from "react";
import { useDevFlow } from "@/context/devflow-context";
import { PRIORITY_BADGES } from "@/lib/constants";
import { TaskStatus } from "@/types";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  CloseIcon,
  CheckIcon,
} from "@/components/icons";

export function TasksList() {
  const {
    tasks,
    projects,
    toggleTaskDone,
    deleteTask,
    openCreateTaskModal,
  } = useDevFlow();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const filteredTasks = tasks.filter((task) => {
    const matchesQuery =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? task.status !== "done"
        : statusFilter === "completed"
        ? task.status === "done"
        : task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesProject =
      projectFilter === "all" || task.projectId === projectFilter;

    return matchesQuery && matchesStatus && matchesPriority && matchesProject;
  });

  const completedCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Tarefas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerenciamento e acompanhamento de tarefas com marcação de conclusão e prioridades.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateTaskModal("todo")}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          Nova Tarefa
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative flex-1 min-w-[220px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              startTransition(() => setSearchQuery(val));
            }}
            placeholder="Buscar por título ou responsável..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Apenas Pendentes</option>
          <option value="completed">Concluídas</option>
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Andamento</option>
          <option value="in_review">Em Revisão</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">Todas as Prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">Todos os Projetos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.key} - {p.name}
            </option>
          ))}
        </select>

        {/* Metrics Badge */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium ml-auto pl-2">
          {completedCount} de {tasks.length} concluídas
        </div>
      </div>

      {/* Tasks Table/List */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <CheckIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Nenhuma tarefa encontrada
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
              Não há tarefas correspondentes aos filtros selecionados. Experimente limpar os filtros ou crie uma nova tarefa.
            </p>
            <button
              type="button"
              onClick={() => openCreateTaskModal("todo")}
              className="mt-4 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              + Criar Tarefa
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredTasks.map((task) => {
              const badge = PRIORITY_BADGES[task.priority];
              const project = projects.find((p) => p.id === task.projectId);
              const isDone = task.status === "done";

              return (
                <li
                  key={task.id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors ${
                    isDone
                      ? "bg-zinc-50/50 dark:bg-zinc-900/40"
                      : "hover:bg-zinc-50/75 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTaskDone(task.id)}
                      className={`mt-0.5 sm:mt-0 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500"
                      }`}
                    >
                      {isDone && <CheckIcon className="h-3 w-3" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-medium ${
                            isDone
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {task.title}
                        </span>

                        {project && (
                          <span className="font-mono text-[10px] uppercase rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-500 dark:text-zinc-400">
                            {project.key}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Responsável: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{task.assignee.name}</strong> • Prazo: {task.dueDate || "Sem prazo"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges & Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>

                    <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-400 capitalize">
                      {task.status.replace("_", " ")}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      title="Excluir tarefa"
                      className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
