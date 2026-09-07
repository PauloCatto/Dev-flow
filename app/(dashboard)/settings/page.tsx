export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Configurações da Organização
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Gerencie preferências do workspace, permissões de equipe e integrações.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Perfil do Workspace
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Informações visíveis para os membros da sua equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nome do Workspace
            </label>
            <input
              type="text"
              defaultValue="DevFlow Core Org"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Slug da URL
            </label>
            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-500">
              <span className="px-3 py-2">app.devflow.io/</span>
              <input
                type="text"
                defaultValue="devflow-core"
                className="w-full bg-transparent px-2 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
