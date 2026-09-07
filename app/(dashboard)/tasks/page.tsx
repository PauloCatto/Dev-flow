import { MOCK_TASKS } from "@/lib/mock-data";
import { PRIORITY_BADGES } from "@/lib/constants";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Tarefas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerenciamento e acompanhamento de tarefas por sprint e prioridade.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          + Nova Tarefa
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {MOCK_TASKS.map((task) => {
            const badge = PRIORITY_BADGES[task.priority];

            return (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-zinc-50/75 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    readOnly
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Responsável: {task.assignee.name} • Prazo: {task.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400 capitalize">
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
