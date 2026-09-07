import Link from "next/link";
import { Project } from "@/types";

const projects: Project[] = [
  {
    id: "1",
    name: "DevFlow SaaS Core",
    description: "Arquitetura base e App Shell",
    key: "DFC",
    lead: "Paulo Developer",
    tasksCount: 16,
    completedTasks: 12,
    status: "Ativo",
    updatedAt: "Há 10 minutos",
  },
  {
    id: "2",
    name: "Design System & UI Kit",
    description: "Componentes atômicos com Tailwind v4",
    key: "DSK",
    lead: "Frontend Team",
    tasksCount: 8,
    completedTasks: 5,
    status: "Em progresso",
    updatedAt: "Há 2 horas",
  },
  {
    id: "3",
    name: "Módulo Kanban Drag-and-Drop",
    description: "Quadro de fluxo de tarefas",
    key: "KAN",
    lead: "Agile Team",
    tasksCount: 14,
    completedTasks: 2,
    status: "Planejado",
    updatedAt: "Ontem",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Projetos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerencie e monitore todos os repositórios e iniciativas da sua organização.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          + Criar Novo Projeto
        </button>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-xs dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-medium">
            <tr>
              <th scope="col" className="px-5 py-3">
                Nome do Projeto
              </th>
              <th scope="col" className="px-5 py-3">
                Chave
              </th>
              <th scope="col" className="px-5 py-3">
                Responsável
              </th>
              <th scope="col" className="px-5 py-3">
                Total de Tarefas
              </th>
              <th scope="col" className="px-5 py-3">
                Última Atualização
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
            {projects.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-zinc-50/75 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  <Link
                    href={`/projects/${p.id}`}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-4 font-mono text-zinc-500 dark:text-zinc-400">
                  {p.key}
                </td>
                <td className="px-5 py-4">{p.lead}</td>
                <td className="px-5 py-4">{p.tasksCount} tarefas</td>
                <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                  {p.updatedAt}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/kanban?project=${p.id}`}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                  >
                    Abrir Kanban →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
