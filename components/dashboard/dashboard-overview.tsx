"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useDevFlow } from "@/context/devflow-context";
import { PlusIcon } from "@/components/icons";

export function DashboardOverview() {
  const { projects, tasks, openCreateProjectModal, openCreateTaskModal } = useDevFlow();

  const activeProjectsCount = projects.filter(
    (p) => p.status === "Ativo" || p.status === "Em progresso"
  ).length;

  const completedTasksCount = tasks.filter((t) => t.status === "done").length;
  const totalTasksCount = tasks.length;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Painel Geral
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Acompanhe o andamento dos seus projetos e métricas em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge version="0.2.0" status="Live Workspace" />
          <button
            type="button"
            onClick={() => openCreateTaskModal("todo")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Projetos Ativos"
          value={String(activeProjectsCount)}
          change={`Total: ${projects.length} cadastrados`}
          trend="up"
        />
        <MetricCard
          label="Tarefas Concluídas"
          value={`${completedTasksCount} / ${totalTasksCount}`}
          change={`${completionPercentage}% concluído`}
          trend="up"
        />
        <MetricCard
          label="Sprints em Aberto"
          value="2"
          change="Sprint 14 em andamento"
          trend="neutral"
        />
        <MetricCard
          label="Membros na Equipe"
          value="4"
          change="Workspace Dev"
          trend="neutral"
        />
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Projetos Recentes
          </h2>
          <Link
            href="/projects"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Ver todos ({projects.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const totalProjectTasks = projectTasks.length || project.tasksCount;
            const completedProjectTasks =
              projectTasks.filter((t) => t.status === "done").length ||
              project.completedTasks;

            const progress =
              totalProjectTasks > 0
                ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
                : 0;

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/kanban?project=${project.id}`}
                      className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {project.name}
                    </Link>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Progresso ({completedProjectTasks}/{totalProjectTasks})</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
