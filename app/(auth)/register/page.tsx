"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

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
            Criar Conta no DevFlow
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Cadastre seu perfil para colaborar nos projetos da organização.
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
              htmlFor="name"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Nome Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex: Ana Silva"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              E-mail *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="ana@devflow.io"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Cargo / Papel na Equipe
            </label>
            <select
              id="role"
              name="role"
              defaultValue="Developer"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Developer">Developer</option>
              <option value="Tech Lead">Tech Lead</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Product Designer">Product Designer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Senha (mínimo 6 caracteres) *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {pending ? "Criando conta..." : "Criar Conta e Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}

