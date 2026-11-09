"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { readLocalDb, writeLocalDb, StoredUser } from "@/lib/local-db";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { AuthUser } from "@/types";

export interface AuthFormState {
  error?: string;
}

const DEMO_USER: AuthUser = {
  id: "user-demo-paulo",
  name: "Paulo Developer",
  email: "paulo@devflow.io",
  role: "Tech Lead",
};

async function ensureSqliteUserTable() {
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'Developer', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`
  );

  const rows = await prisma.$queryRawUnsafe<StoredUser[]>(
    `SELECT "id", "name", "email", "passwordHash", "role" FROM "User" WHERE "email" = ? LIMIT 1`,
    DEMO_USER.email
  );

  if (rows.length === 0) {
    const demoHash = hashPassword("123456");
    await prisma.$executeRawUnsafe(
      `INSERT INTO "User" ("id", "name", "email", "passwordHash", "role") VALUES (?, ?, ?, ?, ?)`,
      DEMO_USER.id,
      DEMO_USER.name,
      DEMO_USER.email,
      demoHash,
      DEMO_USER.role
    );
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function loginAction(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Preencha seu e-mail e sua senha." };
  }

  let authenticatedUser: AuthUser | null = null;

  try {
    await ensureSqliteUserTable();

    const rows = await prisma.$queryRawUnsafe<StoredUser[]>(
      `SELECT "id", "name", "email", "passwordHash", "role" FROM "User" WHERE "email" = ? LIMIT 1`,
      email
    );

    const user = rows[0];
    if (user && verifyPassword(password, user.passwordHash)) {
      authenticatedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }
  } catch {
    const db = await readLocalDb();
    const localUser = db.users.find((u) => u.email.toLowerCase() === email);
    if (localUser && verifyPassword(password, localUser.passwordHash)) {
      authenticatedUser = {
        id: localUser.id,
        name: localUser.name,
        email: localUser.email,
        role: localUser.role,
      };
    }
  }

  if (!authenticatedUser) {
    const db = await readLocalDb();
    const localUser = db.users.find((u) => u.email.toLowerCase() === email);
    if (localUser && verifyPassword(password, localUser.passwordHash)) {
      authenticatedUser = {
        id: localUser.id,
        name: localUser.name,
        email: localUser.email,
        role: localUser.role,
      };
    }
  }

  if (!authenticatedUser) {
    return { error: "Credenciais inválidas. Verifique seu e-mail e senha." };
  }

  const token = signSessionToken(authenticatedUser);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function registerAction(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "Developer").trim();

  if (name.length < 2) {
    return { error: "O nome deve ter pelo menos 2 caracteres." };
  }

  if (!email.includes("@")) {
    return { error: "Informe um endereço de e-mail válido." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const newId = `user-${randomBytes(8).toString("hex")}`;
  const finalRole = role || "Developer";
  const passwordHash = hashPassword(password);

  const db = await readLocalDb();
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "Este e-mail já está cadastrado no DevFlow." };
  }

  db.users.push({
    id: newId,
    name,
    email,
    passwordHash,
    role: finalRole,
  });
  await writeLocalDb(db);

  try {
    await ensureSqliteUserTable();

    const existing = await prisma.$queryRawUnsafe<StoredUser[]>(
      `SELECT "id" FROM "User" WHERE "email" = ? LIMIT 1`,
      email
    );

    if (existing.length > 0) {
      return { error: "Este e-mail já está cadastrado no DevFlow." };
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO "User" ("id", "name", "email", "passwordHash", "role") VALUES (?, ?, ?, ?, ?)`,
      newId,
      name,
      email,
      passwordHash,
      finalRole
    );
  } catch {
    void 0;
  }

  const token = signSessionToken({
    id: newId,
    name,
    email,
    role: finalRole,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
