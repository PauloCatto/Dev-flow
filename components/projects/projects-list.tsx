"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { SearchIcon, CloseIcon } from "@/components/icons";

interface ProjectsListProps {
  initialProjects: Project[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

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

    setProjects((prev) => [newProject, ...prev]);
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Filtragem dos projetos com base no termo digitado
  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.key.toLowerCase().includes(query) ||
      p.lead.toLowerCase().includes(query) ||
      p.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header com Título e Botão de Ação */}
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

      {/* Barra de Busca com Feedback Visual de Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            {/* Ícone de busca na esquerda */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <SearchIcon className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por nome, chave, responsável ou status..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-9 text-xs text-zinc-900 placeholder-zinc-400 shadow-2xs focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />

            {/* Ações na direita: Spinner de busca ou Botão de Limpar */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isPending ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  title="Limpar busca"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Contador Dinâmico de Resultados */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
            {searchQuery ? (
              <span>
                Mostrando <strong className="text-zinc-900 dark:text-zinc-100">{filteredProjects.length}</strong> de{" "}
                {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
              </span>
            ) : (
              <span>
                Total: <strong className="text-zinc-900 dark:text-zinc-100">{projects.length}</strong> projetos
              </span>
            )}
          </div>
        </div>

        {/* Chip Informativo quando há filtro ativo */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Filtro ativo:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              &ldquo;{searchQuery}&rdquo;
              <button
                type="button"
                onClick={clearSearch}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Projects Table & Empty State */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {filteredProjects.length === 0 ? (
          /* Empty State Amigável com Ação de Reset */
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <SearchIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Nenhum projeto encontrado
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
              Não encontramos resultados para &ldquo;{searchQuery}&rdquo;. Tente buscar por outros termos ou limpe o filtro atual.
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-4 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Limpar busca
            </button>
          </div>
        ) : (
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
              {filteredProjects.map((p) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Criação */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
