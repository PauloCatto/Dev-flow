import { KANBAN_COLUMNS } from "@/lib/constants";
import { MOCK_TASKS } from "@/lib/mock-data";

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quadro Kanban
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Arraste e solte cartões para atualizar o fluxo de entrega da equipe.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
        >
          + Adicionar Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {KANBAN_COLUMNS.map((column) => {
          const tasksInColumn = MOCK_TASKS.filter(
            (task) => task.status === column.id
          );

          return (
            <div
              key={column.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  {column.title}
                </h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {tasksInColumn.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasksInColumn.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3.5 shadow-2xs hover:shadow-xs transition-shadow cursor-grab active:cursor-grabbing dark:border-zinc-700/60 dark:bg-zinc-900"
                  >
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {task.title}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium dark:bg-zinc-800">
                        {task.priority}
                      </span>
                      <span>{task.assignee.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
