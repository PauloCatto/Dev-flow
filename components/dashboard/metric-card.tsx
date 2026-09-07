export interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, change, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <span
          className={`inline-flex items-center text-xs font-medium ${
            trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
