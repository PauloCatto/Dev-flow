"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useDevFlow } from "@/context/devflow-context";
import { PlusIcon, ProjectsIcon } from "@/components/icons";

export function DashboardOverview() {
  const { projects, tasks, currentUser, openCreateTaskModal } = useDevFlow();

  const activeProjectsCount = projects.filter(
    (p) => p.status === "Ativo" || p.status === "Em progresso"
  ).length;

  const completedTasksCount = tasks.filter((t) => t.status === "done").length;
  const inProgressTasksCount = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "in_review"
  ).length;
  const totalTasksCount = tasks.length;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  const uniqueMembers = new Set<string>();
  if (currentUser?.name) uniqueMembers.add(currentUser.name);
  projects.forEach((p) => {
    if (p.lead) uniqueMembers.add(p.lead);
  });
  tasks.forEach((t) => {
    if (t.assignee?.name) uniqueMembers.add(t.assignee.name);
  });

  return (
    <div className="space-y-8">
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
          {projects.length > 0 && (
            <button
              type="button"
              onClick={() => openCreateTaskModal("todo")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Nova Tarefa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Projetos Ativos"
          value={String(activeProjectsCount)}
          change={`Total: ${projects.length} cadastrados`}
          trend={activeProjectsCount > 0 ? "up" : "neutral"}
        />
        <MetricCard
          label="Tarefas Concluídas"
          value={`${completedTasksCount} / ${totalTasksCount}`}
          change={`${completionPercentage}% concluído`}
          trend={completedTasksCount > 0 ? "up" : "neutral"}
        />
        <MetricCard
          label="Em Andamento / Revisão"
          value={String(inProgressTasksCount)}
          change={
            inProgressTasksCount > 0
              ? "Tarefas ativas na sprint"
              : "Nenhuma tarefa em andamento"
          }
          trend="neutral"
        />
        <MetricCard
          label="Colaboradores no Workspace"
          value={String(Math.max(1, uniqueMembers.size))}
          change={currentUser?.role || "Workspace"}
          trend="neutral"
        />
      </div>

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

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ProjectsIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Nenhum projeto cadastrado
            </h3>
            <p className="mt-1 max-w-md text-xs text-zinc-500 dark:text-zinc-400">
              Crie um projeto para organizar suas sprints, cadastrar tarefas e acompanhar o progresso de entregas no quadro Kanban.
            </p>
            <div className="mt-5">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Criar Novo Projeto
              </Link>
            </div>
          </div>
        ) : (
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
                        href={`/projects/${project.id}`}
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
        )}
      </div>
    </div>
  );
}
