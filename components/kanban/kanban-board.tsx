"use client";

import { useState, useTransition } from "react";
import { useDevFlow } from "@/context/devflow-context";
import { KANBAN_COLUMNS, PRIORITY_BADGES } from "@/lib/constants";
import { Task, TaskPriority, TaskStatus } from "@/types";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  GripVerticalIcon,
  CloseIcon,
} from "@/components/icons";

export function KanbanBoard() {
  const {
    tasks,
    projects,
    updateTaskStatus,
    deleteTask,
    openCreateTaskModal,
  } = useDevFlow();

  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    // Only reset if actually leaving the container
    const related = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(related)) {
      if (dragOverColumn === columnId) {
        setDragOverColumn(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, columnId);
    }
    setDragOverColumn(null);
    setDraggedTaskId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesQuery =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesProject =
      selectedProjectId === "all" || task.projectId === selectedProjectId;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesQuery && matchesProject && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quadro Kanban
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Arraste e solte cartões entre colunas ou use as ações rápidas para gerenciar o fluxo de entrega.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateTaskModal("todo")}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          Adicionar Cartão
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative flex-1 min-w-[200px]">
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
            placeholder="Filtrar cartões..."
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

        {/* Project Selector */}
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">Todos os Projetos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.key} - {p.name}
            </option>
          ))}
        </select>

        {/* Priority Selector */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">Todas Prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        {(searchQuery || selectedProjectId !== "all" || selectedPriority !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedProjectId("all");
              setSelectedPriority("all");
            }}
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {KANBAN_COLUMNS.map((column) => {
          const tasksInColumn = filteredTasks.filter(
            (task) => task.status === column.id
          );
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`rounded-2xl border transition-all duration-200 p-4 flex flex-col min-h-[500px] ${
                isOver
                  ? "border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/25 ring-2 ring-emerald-500/20"
                  : "border-zinc-200 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/60"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    {column.title}
                  </h3>
                  <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {tasksInColumn.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateTaskModal(column.id)}
                  title={`Adicionar cartão em ${column.title}`}
                  className="rounded-md p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {tasksInColumn.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center p-4">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Solte cartões aqui ou
                    </p>
                    <button
                      type="button"
                      onClick={() => openCreateTaskModal(column.id)}
                      className="mt-1 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"
                    >
                      + Criar cartão
                    </button>
                  </div>
                ) : (
                  tasksInColumn.map((task) => {
                    const isDragging = draggedTaskId === task.id;
                    const badge = PRIORITY_BADGES[task.priority];
                    const project = projects.find((p) => p.id === task.projectId);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`group relative rounded-xl border bg-white p-3.5 shadow-2xs transition-all duration-200 cursor-grab active:cursor-grabbing dark:bg-zinc-900 ${
                          isDragging
                            ? "opacity-40 scale-95 border-emerald-500 ring-2 ring-emerald-500/30"
                            : "border-zinc-200 hover:border-zinc-300 hover:shadow-xs dark:border-zinc-800 dark:hover:border-zinc-700"
                        }`}
                      >
                        {/* Top: Project Key & Drag Indicator */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
                            {project ? project.key : "DEV"}
                          </span>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => deleteTask(task.id)}
                              title="Excluir cartão"
                              className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-zinc-300 dark:text-zinc-600">
                              <GripVerticalIcon className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Footer: Priority & Assignee & Quick Move */}
                        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px]">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${badge.className}`}
                          >
                            {badge.label}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Accessible Column Mover */}
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(task.id, e.target.value as TaskStatus)
                              }
                              title="Mover para outra coluna"
                              className="rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
                            >
                              {KANBAN_COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  → {c.title}
                                </option>
                              ))}
                            </select>

                            <span
                              title={task.assignee.name}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                              {task.assignee.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
