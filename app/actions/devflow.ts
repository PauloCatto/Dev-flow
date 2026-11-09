"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  readLocalDb,
  writeLocalDb,
  DEMO_USER_ID,
  DEMO_USER_EMAIL,
} from "@/lib/local-db";
import { getCurrentUser } from "@/app/actions/auth";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from "@/types";

interface SqlProjectRow {
  id: string;
  userId: string;
  name: string;
  description: string;
  key: string;
  lead: string;
  tasksCount: number;
  completedTasks: number;
  status: string;
  updatedAt: string;
}

interface SqlTaskRow {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigneeName: string;
  dueDate: string | null;
  createdAt: string;
}

function mapDbProject(p: SqlProjectRow): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    key: p.key,
    lead: p.lead,
    tasksCount: Number(p.tasksCount) || 0,
    completedTasks: Number(p.completedTasks) || 0,
    status: p.status as ProjectStatus,
    updatedAt: p.updatedAt,
  };
}

function mapDbTask(t: SqlTaskRow): Task {
  return {
    id: t.id,
    projectId: t.projectId,
    title: t.title,
    description: t.description ?? undefined,
    status: t.status as TaskStatus,
    priority: t.priority as TaskPriority,
    assignee: {
      name: t.assigneeName,
    },
    dueDate: t.dueDate ?? undefined,
    createdAt: t.createdAt,
  };
}

async function resolveOwnerKey(): Promise<{ userId: string; isDemo: boolean }> {
  const user = await getCurrentUser();
  if (!user) {
    return { userId: DEMO_USER_ID, isDemo: true };
  }
  const isDemo =
    user.email.toLowerCase() === DEMO_USER_EMAIL || user.id === DEMO_USER_ID;
  return {
    userId: isDemo ? DEMO_USER_ID : user.id,
    isDemo,
  };
}

async function ensureSqliteTenantColumnsAndSeed() {
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Project" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'user-demo-paulo'`
    );
  } catch {
    void 0;
  }

  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Task" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'user-demo-paulo'`
    );
  } catch {
    void 0;
  }

  const demoRows = await prisma.$queryRawUnsafe<{ cnt: number | bigint }[]>(
    `SELECT COUNT(*) as cnt FROM "Project" WHERE "userId" = ?`,
    DEMO_USER_ID
  );

  const count = Number(demoRows[0]?.cnt ?? 0);
  if (count === 0) {
    for (const proj of MOCK_PROJECTS) {
      await prisma.$executeRawUnsafe(
        `INSERT OR IGNORE INTO "Project" ("id", "userId", "name", "description", "key", "lead", "tasksCount", "completedTasks", "status", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        proj.id,
        DEMO_USER_ID,
        proj.name,
        proj.description,
        proj.key,
        proj.lead,
        proj.tasksCount,
        proj.completedTasks,
        proj.status,
        proj.updatedAt
      );
    }

    for (const task of MOCK_TASKS) {
      await prisma.$executeRawUnsafe(
        `INSERT OR IGNORE INTO "Task" ("id", "userId", "projectId", "title", "description", "status", "priority", "assigneeName", "dueDate", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        task.id,
        DEMO_USER_ID,
        task.projectId,
        task.title,
        task.description ?? null,
        task.status,
        task.priority,
        task.assignee.name,
        task.dueDate ?? "Sem prazo",
        task.createdAt
      );
    }
  }
}

async function syncProjectCountersSqlite(projectId: string, userId: string) {
  const totalRows = await prisma.$queryRawUnsafe<{ cnt: number | bigint }[]>(
    `SELECT COUNT(*) as cnt FROM "Task" WHERE "projectId" = ? AND "userId" = ?`,
    projectId,
    userId
  );
  const doneRows = await prisma.$queryRawUnsafe<{ cnt: number | bigint }[]>(
    `SELECT COUNT(*) as cnt FROM "Task" WHERE "projectId" = ? AND "userId" = ? AND "status" = 'done'`,
    projectId,
    userId
  );

  const total = Number(totalRows[0]?.cnt ?? 0);
  const completed = Number(doneRows[0]?.cnt ?? 0);

  await prisma.$executeRawUnsafe(
    `UPDATE "Project" SET "tasksCount" = ?, "completedTasks" = ?, "updatedAt" = 'Agora mesmo' WHERE "id" = ? AND "userId" = ?`,
    total,
    completed,
    projectId,
    userId
  );
}

function revalidateWorkspace() {
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/kanban");
}

export async function getInitialWorkspaceData(): Promise<{
  projects: Project[];
  tasks: Task[];
}> {
  const { userId } = await resolveOwnerKey();

  try {
    await ensureSqliteTenantColumnsAndSeed();

    const [dbProjects, dbTasks] = await Promise.all([
      prisma.$queryRawUnsafe<SqlProjectRow[]>(
        `SELECT "id", "userId", "name", "description", "key", "lead", "tasksCount", "completedTasks", "status", "updatedAt" FROM "Project" WHERE "userId" = ? ORDER BY "createdAt" DESC`,
        userId
      ),
      prisma.$queryRawUnsafe<SqlTaskRow[]>(
        `SELECT "id", "userId", "projectId", "title", "description", "status", "priority", "assigneeName", "dueDate", "createdAt" FROM "Task" WHERE "userId" = ? ORDER BY "createdDate" DESC`,
        userId
      ),
    ]);

    return {
      projects: dbProjects.map(mapDbProject),
      tasks: dbTasks.map(mapDbTask),
    };
  } catch {
    const localDb = await readLocalDb();
    return {
      projects: localDb.projects
        .filter((p) => p.userId === userId)
        .map(({ userId: _u, ...rest }) => rest),
      tasks: localDb.tasks
        .filter((t) => t.userId === userId)
        .map(({ userId: _u, ...rest }) => rest),
    };
  }
}

export async function createProjectAction(
  data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt"> & {
    id?: string;
  }
): Promise<Project> {
  const { userId } = await resolveOwnerKey();
  const id = data.id || `proj-${Date.now()}`;
  const newProject: Project = {
    id,
    name: data.name,
    description: data.description,
    key: data.key,
    lead: data.lead,
    status: data.status,
    tasksCount: 0,
    completedTasks: 0,
    updatedAt: "Agora mesmo",
  };

  const localDb = await readLocalDb();
  localDb.projects = [{ ...newProject, userId }, ...localDb.projects];
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Project" ("id", "userId", "name", "description", "key", "lead", "tasksCount", "completedTasks", "status", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, 'Agora mesmo')`,
      id,
      userId,
      data.name,
      data.description,
      data.key,
      data.lead,
      data.status
    );
  } catch {
    void 0;
  }

  revalidateWorkspace();
  return newProject;
}

export async function updateProjectAction(
  id: string,
  data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.projects = localDb.projects.map((p) =>
    p.id === id && p.userId === userId
      ? { ...p, ...data, updatedAt: "Agora mesmo" }
      : p
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    const existing = await prisma.$queryRawUnsafe<SqlProjectRow[]>(
      `SELECT * FROM "Project" WHERE "id" = ? AND "userId" = ? LIMIT 1`,
      id,
      userId
    );
    const current = existing[0];
    if (current) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Project" SET "name" = ?, "description" = ?, "key" = ?, "lead" = ?, "status" = ?, "updatedAt" = 'Agora mesmo' WHERE "id" = ? AND "userId" = ?`,
        data.name ?? current.name,
        data.description ?? current.description,
        data.key ?? current.key,
        data.lead ?? current.lead,
        data.status ?? current.status,
        id,
        userId
      );
    }
  } catch {
    void 0;
  }

  revalidateWorkspace();
  revalidatePath(`/projects/${id}`);
}

export async function deleteProjectAction(id: string): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.projects = localDb.projects.filter(
    (p) => !(p.id === id && p.userId === userId)
  );
  localDb.tasks = localDb.tasks.filter(
    (t) => !(t.projectId === id && t.userId === userId)
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    await prisma.$executeRawUnsafe(
      `DELETE FROM "Task" WHERE "projectId" = ? AND "userId" = ?`,
      id,
      userId
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "Project" WHERE "id" = ? AND "userId" = ?`,
      id,
      userId
    );
  } catch {
    void 0;
  }

  revalidateWorkspace();
}

export async function createTaskAction(
  data: Omit<Task, "id" | "createdAt"> & { id?: string }
): Promise<Task> {
  const { userId } = await resolveOwnerKey();
  const id = data.id || `task-${Date.now()}`;
  const newTask: Task = {
    id,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    assignee: data.assignee,
    dueDate: data.dueDate ?? "Sem prazo",
    createdAt: "Hoje",
  };

  const localDb = await readLocalDb();
  localDb.tasks = [{ ...newTask, userId }, ...localDb.tasks];
  localDb.projects = localDb.projects.map((p) =>
    p.id === data.projectId && p.userId === userId
      ? {
          ...p,
          tasksCount: p.tasksCount + 1,
          completedTasks:
            data.status === "done" ? p.completedTasks + 1 : p.completedTasks,
          updatedAt: "Agora mesmo",
        }
      : p
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Task" ("id", "userId", "projectId", "title", "description", "status", "priority", "assigneeName", "dueDate", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Hoje')`,
      id,
      userId,
      data.projectId,
      data.title,
      data.description ?? null,
      data.status,
      data.priority,
      data.assignee.name,
      data.dueDate ?? "Sem prazo"
    );
    await syncProjectCountersSqlite(data.projectId, userId);
  } catch {
    void 0;
  }

  revalidateWorkspace();
  revalidatePath(`/projects/${data.projectId}`);
  return newTask;
}

export async function updateTaskAction(
  taskId: string,
  data: Partial<Omit<Task, "id" | "createdAt">>
): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.tasks = localDb.tasks.map((t) =>
    t.id === taskId && t.userId === userId ? { ...t, ...data } : t
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    const rows = await prisma.$queryRawUnsafe<SqlTaskRow[]>(
      `SELECT * FROM "Task" WHERE "id" = ? AND "userId" = ? LIMIT 1`,
      taskId,
      userId
    );
    const existing = rows[0];
    if (existing) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Task" SET "title" = ?, "description" = ?, "projectId" = ?, "status" = ?, "priority" = ?, "assigneeName" = ?, "dueDate" = ? WHERE "id" = ? AND "userId" = ?`,
        data.title ?? existing.title,
        data.description !== undefined
          ? data.description ?? null
          : existing.description,
        data.projectId ?? existing.projectId,
        data.status ?? existing.status,
        data.priority ?? existing.priority,
        data.assignee?.name ?? existing.assigneeName,
        data.dueDate ?? existing.dueDate,
        taskId,
        userId
      );

      await syncProjectCountersSqlite(existing.projectId, userId);
      if (data.projectId && data.projectId !== existing.projectId) {
        await syncProjectCountersSqlite(data.projectId, userId);
      }
    }
  } catch {
    void 0;
  }

  revalidateWorkspace();
}

export async function updateTaskStatusAction(
  taskId: string,
  newStatus: TaskStatus
): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.tasks = localDb.tasks.map((t) =>
    t.id === taskId && t.userId === userId ? { ...t, status: newStatus } : t
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    const rows = await prisma.$queryRawUnsafe<SqlTaskRow[]>(
      `SELECT * FROM "Task" WHERE "id" = ? AND "userId" = ? LIMIT 1`,
      taskId,
      userId
    );
    const existing = rows[0];
    if (existing) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Task" SET "status" = ? WHERE "id" = ? AND "userId" = ?`,
        newStatus,
        taskId,
        userId
      );
      await syncProjectCountersSqlite(existing.projectId, userId);
    }
  } catch {
    void 0;
  }

  revalidateWorkspace();
}

export async function toggleTaskDoneAction(taskId: string): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.tasks = localDb.tasks.map((t) =>
    t.id === taskId && t.userId === userId
      ? { ...t, status: t.status === "done" ? "todo" : "done" }
      : t
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    const rows = await prisma.$queryRawUnsafe<SqlTaskRow[]>(
      `SELECT * FROM "Task" WHERE "id" = ? AND "userId" = ? LIMIT 1`,
      taskId,
      userId
    );
    const existing = rows[0];
    if (existing) {
      const nextStatus: TaskStatus =
        existing.status === "done" ? "todo" : "done";
      await prisma.$executeRawUnsafe(
        `UPDATE "Task" SET "status" = ? WHERE "id" = ? AND "userId" = ?`,
        nextStatus,
        taskId,
        userId
      );
      await syncProjectCountersSqlite(existing.projectId, userId);
    }
  } catch {
    void 0;
  }

  revalidateWorkspace();
}

export async function deleteTaskAction(taskId: string): Promise<void> {
  const { userId } = await resolveOwnerKey();

  const localDb = await readLocalDb();
  localDb.tasks = localDb.tasks.filter(
    (t) => !(t.id === taskId && t.userId === userId)
  );
  await writeLocalDb(localDb);

  try {
    await ensureSqliteTenantColumnsAndSeed();
    const rows = await prisma.$queryRawUnsafe<SqlTaskRow[]>(
      `SELECT * FROM "Task" WHERE "id" = ? AND "userId" = ? LIMIT 1`,
      taskId,
      userId
    );
    const existing = rows[0];
    if (existing) {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "Task" WHERE "id" = ? AND "userId" = ?`,
        taskId,
        userId
      );
      await syncProjectCountersSqlite(existing.projectId, userId);
    }
  } catch {
    void 0;
  }

  revalidateWorkspace();
}
