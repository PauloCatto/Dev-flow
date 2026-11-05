"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDevFlow } from "@/context/devflow-context";
import { KANBAN_COLUMNS, PRIORITY_BADGES } from "@/lib/constants";
import { TaskStatus } from "@/types";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import {
  ArrowLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  KanbanIcon,
} from "@/components/icons";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const router = useRouter();
  const {
    projects,
    tasks,
    addProject,
    updateProject,
    deleteProject,
    toggleTaskDone,
    updateTaskStatus,
    deleteTask,
    openCreateTaskModal,
    openEditTaskModal,
  } = useDevFlow();

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Projeto não encontrado
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          O projeto solicitado não existe ou foi removido do workspace.
        </p>
        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Voltar para Projetos
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const filteredTasks = projectTasks.filter((t) =>
    statusFilter === "all" ? true : t.status === statusFilter
  );

  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = projectTasks.filter(
    (t) => t.status === "in_progress" || t.status === "in_review"
  ).length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDeleteProject = () => {
    deleteProject(project.id);
    router.push("/projects");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Voltar para Projetos
        </Link>

        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Atualizado: {project.updatedAt}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {project.key}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {project.name}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900">
                {project.status}
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {project.description}
            </p>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              Líder / Responsável:{" "}
              <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                {project.lead}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href={`/kanban?project=${project.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <KanbanIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Ver no Kanban
            </Link>

            <button
              type="button"
              onClick={() => setIsEditProjectOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <EditIcon className="h-3.5 w-3.5" />
              Editar
            </button>

            <button
              type="button"
              onClick={() => openCreateTaskModal("todo", project.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Nova Tarefa
            </button>

            <button
              type="button"
              onClick={handleDeleteProject}
              title="Excluir projeto"
              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 transition-colors cursor-pointer"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Progresso Geral do Projeto
            </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {progress}% ({completedTasks} de {totalTasks} concluídas)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total de Tarefas"
          value={String(totalTasks)}
          change={`Chave ${project.key}`}
          trend="neutral"
        />
        <MetricCard
          label="Em Andamento / Revisão"
          value={String(inProgressTasks)}
          change="Fluxo ativo"
          trend="up"
        />
        <MetricCard
          label="Tarefas Concluídas"
          value={String(completedTasks)}
          change={`${progress}% entregue`}
          trend="up"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Tarefas do Projeto ({filteredTasks.length})
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">Todos os Status</option>
              {KANBAN_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Nenhuma tarefa neste projeto
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Adicione a primeira tarefa para acompanhar o progresso de {project.name}.
              </p>
              <button
                type="button"
                onClick={() => openCreateTaskModal("todo", project.id)}
                className="mt-4 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                + Adicionar Tarefa
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredTasks.map((task) => {
                const badge = PRIORITY_BADGES[task.priority];
                const isDone = task.status === "done";

                return (
                  <li
                    key={task.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors ${
                      isDone
                        ? "bg-zinc-50/50 dark:bg-zinc-900/40"
                        : "hover:bg-zinc-50/75 dark:hover:bg-zinc-800/50"
                    }`}
                  >
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
                        <p
                          className={`text-sm font-medium ${
                            isDone
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Responsável:{" "}
                          <strong className="font-medium text-zinc-700 dark:text-zinc-300">
                            {task.assignee.name}
                          </strong>{" "}
                          • Prazo: {task.dueDate || "Sem prazo"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(task.id, e.target.value as TaskStatus)
                        }
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                      >
                        {KANBAN_COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => openEditTaskModal(task)}
                        title="Editar tarefa"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        title="Excluir tarefa"
                        className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors cursor-pointer"
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

      <CreateProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onCreateProject={addProject}
        initialProject={project}
        onUpdateProject={updateProject}
      />
    </div>
  );
}

