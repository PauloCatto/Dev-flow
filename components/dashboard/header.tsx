"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { SearchIcon } from "@/components/icons";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Visão Geral" }: HeaderProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

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
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          <span className="hidden sm:inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 font-mono dark:bg-zinc-800 dark:text-zinc-400">
            workspace-principal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
          >
            <SearchIcon className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Buscar páginas, projetos...</span>
            <kbd className="inline-flex items-center gap-0.5 rounded bg-zinc-200/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              Ctrl K
            </kbd>
          </button>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
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
