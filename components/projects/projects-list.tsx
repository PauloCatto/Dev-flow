"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { CreateProjectModal } from "@/components/projects/create-project-modal";

interface ProjectsListProps {
  initialProjects: Project[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateProject = (
    newProjectData: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">
  ) => {
    const newProject: Project = {
      ...newProjectData,
      id: String(Date.now()),
      tasksCount: 0,
      completedTasks: 0,
      updatedAt: "Agora mesmo",
    };

    // Imutabilidade: adicionamos o novo projeto no topo da lista sem mutar o array anterior
    setProjects((prev) => [newProject, ...prev]);
  };

  // Filtragem reativa baseada no input de busca
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
        >
          + Criar Novo Projeto
        </button>
      </div>

      {/* Barra de Filtro e Busca em Tempo Real */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nome, chave ou responsável..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "projeto" : "projetos"}
        </span>
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
                Status
              </th>
              <th scope="col" className="px-5 py-3">
                Tarefas
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
            {filteredProjects.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  Nenhum projeto encontrado para &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
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
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {p.status}
                    </span>
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Interativo de Criação */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
