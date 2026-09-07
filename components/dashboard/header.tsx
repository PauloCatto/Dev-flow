import Link from "next/link";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Visão Geral" }: HeaderProps) {
  return (
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
        {/* Search input placeholder */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Buscar projetos, tarefas... (Ctrl+K)"
            className="w-64 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
          />
        </div>

        {/* Quick Action Button */}
        <Link
          href="/projects?novo=true"
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
  );
}
