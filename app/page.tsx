import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

export default function Home() {
  const appName = "DevFlow";
  const appVersion = "0.1.0";
  const description =
    "Plataforma inteligente de gestão de projetos e produtividade para desenvolvedores.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-4">
        <StatusBadge version={appVersion} status="Em desenvolvimento" />

        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {appName.toUpperCase()}
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {description}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Explorar Projetos
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Documentação
          </a>
        </div>
      </div>
    </main>
  );
}

