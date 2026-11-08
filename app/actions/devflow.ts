"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from "@/types";

function mapDbProject(p: {
  id: string;
  name: string;
  description: string;
  key: string;
  lead: string;
  tasksCount: number;
  completedTasks: number;
  status: string;
  updatedAt: string;
}): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    key: p.key,
    lead: p.lead,
    tasksCount: p.tasksCount,
    completedTasks: p.completedTasks,
    status: p.status as ProjectStatus,
    updatedAt: p.updatedAt,
  };
}

function mapDbTask(t: {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigneeName: string;
  dueDate: string | null;
  createdAt: string;
}): Task {
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

async function syncProjectCounters(projectId: string) {
  const [total, completed] = await Promise.all([
    prisma.task.count({ where: { projectId } }),
    prisma.task.count({ where: { projectId, status: "done" } }),
  ]);

  await prisma.project.updateMany({
    where: { id: projectId },
    data: {
      tasksCount: total,
      completedTasks: completed,
      updatedAt: "Agora mesmo",
    },
  });
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
  const existingCount = await prisma.project.count();

  if (existingCount === 0) {
    for (const proj of MOCK_PROJECTS) {
      await prisma.project.create({
        data: {
          id: proj.id,
          name: proj.name,
          description: proj.description,
          key: proj.key,
          lead: proj.lead,
          tasksCount: proj.tasksCount,
          completedTasks: proj.completedTasks,
          status: proj.status,
          updatedAt: proj.updatedAt,
        },
      });
    }

    for (const task of MOCK_TASKS) {
      await prisma.task.create({
        data: {
          id: task.id,
          projectId: task.projectId,
          title: task.title,
          description: task.description ?? null,
          status: task.status,
          priority: task.priority,
          assigneeName: task.assignee.name,
          dueDate: task.dueDate ?? "Sem prazo",
          createdAt: task.createdAt,
        },
      });
    }
  }

  const [dbProjects, dbTasks] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.task.findMany({ orderBy: { createdDate: "desc" } }),
  ]);

  return {
    projects: dbProjects.map(mapDbProject),
    tasks: dbTasks.map(mapDbTask),
  };
}

export async function createProjectAction(
  data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt"> & {
    id?: string;
  }
): Promise<Project> {
  const created = await prisma.project.create({
    data: {
      ...(data.id ? { id: data.id } : {}),
      name: data.name,
      description: data.description,
      key: data.key,
      lead: data.lead,
      status: data.status,
      tasksCount: 0,
      completedTasks: 0,
      updatedAt: "Agora mesmo",
    },
  });

  revalidateWorkspace();
  return mapDbProject(created);
}

export async function updateProjectAction(
  id: string,
  data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
): Promise<void> {
  await prisma.project.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.key !== undefined ? { key: data.key } : {}),
      ...(data.lead !== undefined ? { lead: data.lead } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      updatedAt: "Agora mesmo",
    },
  });

  revalidateWorkspace();
  revalidatePath(`/projects/${id}`);
}

export async function deleteProjectAction(id: string): Promise<void> {
  await prisma.project.deleteMany({
    where: { id },
  });

  revalidateWorkspace();
}

export async function createTaskAction(
  data: Omit<Task, "id" | "createdAt"> & { id?: string }
): Promise<Task> {
  const created = await prisma.task.create({
    data: {
      ...(data.id ? { id: data.id } : {}),
      projectId: data.projectId,
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      assigneeName: data.assignee.name,
      dueDate: data.dueDate ?? "Sem prazo",
      createdAt: "Hoje",
    },
  });

  await syncProjectCounters(data.projectId);
  revalidateWorkspace();
  revalidatePath(`/projects/${data.projectId}`);

  return mapDbTask(created);
}

export async function updateTaskAction(
  taskId: string,
  data: Partial<Omit<Task, "id" | "createdAt">>
): Promise<void> {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return;

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      ...(data.projectId !== undefined ? { projectId: data.projectId } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.assignee !== undefined
        ? { assigneeName: data.assignee.name }
        : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
    },
  });

  await syncProjectCounters(existing.projectId);
  if (data.projectId && data.projectId !== existing.projectId) {
    await syncProjectCounters(data.projectId);
  }

  revalidateWorkspace();
}

export async function updateTaskStatusAction(
  taskId: string,
  newStatus: TaskStatus
): Promise<void> {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return;

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  await syncProjectCounters(existing.projectId);
  revalidateWorkspace();
}

export async function toggleTaskDoneAction(taskId: string): Promise<void> {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return;

  const nextStatus: TaskStatus = existing.status === "done" ? "todo" : "done";

  await prisma.task.update({
    where: { id: taskId },
    data: { status: nextStatus },
  });

  await syncProjectCounters(existing.projectId);
  revalidateWorkspace();
}

export async function deleteTaskAction(taskId: string): Promise<void> {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) return;

  await prisma.task.delete({ where: { id: taskId } });
  await syncProjectCounters(existing.projectId);
  revalidateWorkspace();
}

