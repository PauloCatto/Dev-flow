export interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, change, trend }: MetricCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Linha Superior: Rótulo e Badge de Tendência */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
          {label}
        </span>
        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {change}
        </span>
      </div>

      {/* Linha Inferior: Valor em destaque sem quebra indesejada */}
      <div className="mt-3">
        <p className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
          {value}
        </p>
      </div>
    </div>
  );
}
