"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/types";
import { useDevFlow } from "@/context/devflow-context";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (
    newProject: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">
  ) => void;
  initialProject?: Project | null;
  onUpdateProject?: (
    id: string,
    data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
  ) => void;
}

export function CreateProjectModal(props: CreateProjectModalProps) {
  if (!props.isOpen) return null;

  return (
    <ProjectModalContent
      key={props.initialProject?.id ?? "new-project"}
      {...props}
    />
  );
}

function ProjectModalContent({
  onClose,
  onCreateProject,
  initialProject,
  onUpdateProject,
}: CreateProjectModalProps) {
  const { currentUser } = useDevFlow();
  const defaultLead = currentUser?.name || "Paulo Developer";

  const [name, setName] = useState(initialProject?.name ?? "");
  const [key, setKey] = useState(initialProject?.key ?? "");
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [lead, setLead] = useState(initialProject?.lead ?? defaultLead);
  const [status, setStatus] = useState<ProjectStatus>(
    initialProject?.status ?? "Ativo"
  );
  const [error, setError] = useState("");

  const isEditing = Boolean(initialProject);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!key || key.length <= 4)) {
      const generatedKey = val
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 4);
      setKey(generatedKey);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("O nome do projeto é obrigatório.");
      return;
    }

    if (!key.trim()) {
      setError("A chave do projeto é obrigatória.");
      return;
    }

    if (initialProject && onUpdateProject) {
      onUpdateProject(initialProject.id, {
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim() || "Sem descrição informada.",
        lead: lead.trim() || defaultLead,
        status,
      });
    } else {
      onCreateProject({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim() || "Sem descrição informada.",
        lead: lead.trim() || defaultLead,
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {isEditing ? "Editar Projeto" : "Criar Novo Projeto"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEditing
                ? "Atualize as informações e o status deste projeto."
                : "Cadastre uma nova iniciativa para gerenciar no DevFlow."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nome do Projeto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Plataforma de Notificações"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Chave (Identificador) *
              </label>
              <input
                type="text"
                value={key}
                maxLength={6}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="Ex: NOT"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono uppercase text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Ativo">Ativo</option>
                <option value="Em progresso">Em progresso</option>
                <option value="Planejado">Planejado</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Responsável
            </label>
            <input
              type="text"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Descrição
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o escopo e os objetivos deste projeto..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              {isEditing ? "Salvar Alterações" : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
