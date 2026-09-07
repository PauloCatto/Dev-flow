"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_NAV_ITEMS } from "@/config/navigation";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { SearchIcon } from "@/components/icons";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredPages = DASHBOARD_NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(normalizedQuery)
  );

  const filteredProjects = MOCK_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.key.toLowerCase().includes(normalizedQuery)
  );

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <SearchIcon className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar páginas, projetos ou ações..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Navegação
              </p>
              <div className="space-y-0.5">
                {filteredPages.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {item.href}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Projetos
              </p>
              <div className="space-y-0.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleNavigate(`/projects/${p.id}`)}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">{p.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-400">
                      {p.key}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredProjects.length === 0 && (
            <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Nenhum resultado encontrado para &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-[11px] text-zinc-500 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900/50">
          <span>Dica: Use para pular para qualquer rota instantaneamente</span>
          <span className="font-mono text-[10px]">DevFlow Spotlight</span>
        </div>
      </div>
    </div>
  );
}
