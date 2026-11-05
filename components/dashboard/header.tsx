"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { SearchIcon, SunIcon, MoonIcon, PlusIcon } from "@/components/icons";
import { useDevFlow } from "@/context/devflow-context";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Visão Geral" }: HeaderProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { resolvedTheme, toggleTheme, openCreateTaskModal } = useDevFlow();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-zinc-200 bg-white/80 px-6 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          <span className="hidden sm:inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 font-mono dark:bg-zinc-800 dark:text-zinc-400">
            workspace-principal
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <SearchIcon className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Buscar páginas, projetos...</span>
            <kbd className="inline-flex items-center gap-0.5 rounded bg-zinc-200/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            title={`Alternar para tema ${resolvedTheme === "dark" ? "claro" : "escuro"}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="h-4 w-4 text-amber-400" />
            ) : (
              <MoonIcon className="h-4 w-4 text-zinc-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openCreateTaskModal("todo")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Tarefa
          </button>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Novo Projeto
          </Link>
        </div>
      </header>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
}
