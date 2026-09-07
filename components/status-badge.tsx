interface StatusBadgeProps {
  version: string;
  status: string;
}

export function StatusBadge({ version, status }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
      />
      <span>
        Versão {version} • {status}
      </span>
    </div>
  );
}
