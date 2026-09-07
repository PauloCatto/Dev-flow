import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MOCK_PROJECTS } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Painel Geral
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Acompanhe o andamento dos seus projetos e métricas em tempo real.
          </p>
        </div>
        <StatusBadge version="0.1.0" status="Live Workspace" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Projetos Ativos"
          value="3"
          change="+1 esta semana"
          trend="up"
        />
        <MetricCard
          label="Tarefas Concluídas"
          value="19 / 38"
          change="50% concluído"
          trend="up"
        />
        <MetricCard
          label="Sprints em Aberto"
          value="2"
          change="No prazo"
          trend="neutral"
        />
        <MetricCard
          label="Membros na Equipe"
          value="4"
          change="Workspace Dev"
          trend="neutral"
        />
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Projetos Recentes
          </h2>
          <Link
            href="/projects"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => {
            const progress = Math.round(
              (project.completedTasks / project.tasksCount) * 100
            );

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {project.name}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Progresso</span>
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
