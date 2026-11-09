"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [email, setEmail] = useState("paulo@devflow.io");
  const [password, setPassword] = useState("123456");

  const fillDemoAccount = () => {
    setEmail("paulo@devflow.io");
    setPassword("123456");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white shadow dark:bg-white dark:text-zinc-900"
          >
            D
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Entrar no DevFlow
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Acesse seu workspace para gerenciar projetos, tarefas e o quadro Kanban.
          </p>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-400">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              E-mail Corporativo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {pending ? "Autenticando..." : "Entrar no Workspace"}
          </button>
        </form>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                Acesso Demo Pré-configurado:
              </p>
              <p className="font-mono">paulo@devflow.io / 123456</p>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
            >
              Preencher
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Ainda não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Criar nova conta
          </Link>
        </p>
      </div>
    </div>
  );
}

