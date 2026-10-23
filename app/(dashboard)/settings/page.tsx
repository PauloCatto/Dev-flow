"use client";

import { useState } from "react";
import { useDevFlow } from "@/context/devflow-context";
import { SunIcon, MoonIcon, CheckIcon } from "@/components/icons";

export default function SettingsPage() {
  const { theme, setTheme } = useDevFlow();

  const [workspaceName, setWorkspaceName] = useState("DevFlow Core Org");
  const [workspaceSlug, setWorkspaceSlug] = useState("devflow-core");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Configurações da Organização
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Gerencie preferências do workspace, temas de exibição e notificações da equipe.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Configurações salvas com sucesso! As alterações foram aplicadas imediatamente.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Profile */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Perfil do Workspace
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Informações visíveis para os membros da sua equipe e colaboradores.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nome do Workspace
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Slug da URL
              </label>
              <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-500 overflow-hidden">
                <span className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800/80 border-r border-zinc-200 dark:border-zinc-700">
                  app.devflow.io/
                </span>
                <input
                  type="text"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                  className="w-full bg-transparent px-2.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Aparência e Tema
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Selecione sua preferência de visualização para o DevFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Option */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                theme === "light"
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-2xs dark:bg-zinc-800">
                <SunIcon className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Tema Claro</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Visual limpo e brilhante</p>
              </div>
            </button>

            {/* Dark Option */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 shadow-2xs text-white">
                <MoonIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Tema Escuro</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Alto contraste e descanso visual</p>
              </div>
            </button>

            {/* System Option */}
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                theme === "system"
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-zinc-200 to-zinc-800 shadow-2xs text-zinc-700">
                <div className="h-4 w-4 rounded-full bg-white dark:bg-zinc-900" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Automático</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Sincroniza com o sistema</p>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Notificações de Atividade
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Escolha quais eventos geram alertas para você.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Resumo semanal de progresso por e-mail
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Relatório com tarefas concluídas e métricas da sprint.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={taskAssignments}
                onChange={(e) => setTaskAssignments(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Notificar quando for atribuído a uma nova tarefa
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Receba alertas instantâneos ao ser marcado como responsável.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
