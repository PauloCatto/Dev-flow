import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { Project, Task } from "@/types";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import { hashPassword } from "@/lib/auth";

export const DEMO_USER_ID = "user-demo-paulo";
export const DEMO_USER_EMAIL = "paulo@devflow.io";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface StoredProject extends Project {
  userId: string;
}

export interface StoredTask extends Task {
  userId: string;
}

interface LocalDatabase {
  users: StoredUser[];
  projects: StoredProject[];
  tasks: StoredTask[];
}

const DB_FILE_PATH = path.join(process.cwd(), "prisma", "local-store.json");

function createInitialDb(): LocalDatabase {
  return {
    users: [
      {
        id: DEMO_USER_ID,
        name: "Paulo Developer",
        email: DEMO_USER_EMAIL,
        passwordHash: hashPassword("123456"),
        role: "Tech Lead",
      },
    ],
    projects: MOCK_PROJECTS.map((p) => ({ ...p, userId: DEMO_USER_ID })),
    tasks: MOCK_TASKS.map((t) => ({ ...t, userId: DEMO_USER_ID })),
  };
}

export async function readLocalDb(): Promise<LocalDatabase> {
  try {
    const raw = await readFile(DB_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LocalDatabase>;
    const defaults = createInitialDb();

    const projects = Array.isArray(parsed.projects)
      ? parsed.projects.map((p) => ({
          ...p,
          userId: p.userId || DEMO_USER_ID,
        }))
      : defaults.projects;

    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.map((t) => ({
          ...t,
          userId: t.userId || DEMO_USER_ID,
        }))
      : defaults.tasks;

    return {
      users:
        Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : defaults.users,
      projects,
      tasks,
    };
  } catch {
    const initial = createInitialDb();
    await writeLocalDb(initial);
    return initial;
  }
}

export async function writeLocalDb(data: LocalDatabase): Promise<void> {
  try {
    await mkdir(path.dirname(DB_FILE_PATH), { recursive: true });
    await writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    return;
  }
}
