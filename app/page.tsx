import Link from "next/link";
import { cookies } from "next/headers";
import { StatusBadge } from "@/components/status-badge";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? verifySessionToken(token) : null;

  const appName = "DevFlow";
  const appVersion = "0.3.0";
  const description =
    "Plataforma inteligente de gestão de projetos e produtividade para desenvolvedores.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 p-6 text-center">
      <div className="max-w-xl space-y-4">
        <StatusBadge version={appVersion} status="Full-Stack SQLite + Auth" />

        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {appName.toUpperCase()}
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {description}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              Ir para o Dashboard ({user.name.split(" ")[0]})
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                Entrar no Workspace
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Criar Conta Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
