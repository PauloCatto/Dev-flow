"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Project, Task, TaskStatus } from "@/types";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  createTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
  toggleTaskDoneAction,
  deleteTaskAction,
} from "@/app/actions/devflow";

type ThemeMode = "light" | "dark" | "system";

interface DevFlowContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  projects: Project[];
  addProject: (
    data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">
  ) => Project;
  updateProject: (
    id: string,
    data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
  ) => void;
  deleteProject: (id: string) => void;

  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (
    taskId: string,
    data: Partial<Omit<Task, "id" | "createdAt">>
  ) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleTaskDone: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  isTaskModalOpen: boolean;
  defaultTaskStatus: TaskStatus;
  defaultTaskProjectId?: string;
  editingTask: Task | null;
  openCreateTaskModal: (status?: TaskStatus, projectId?: string) => void;
  openEditTaskModal: (task: Task) => void;
  closeCreateTaskModal: () => void;

  isProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
}

const DevFlowContext = createContext<DevFlowContextType | undefined>(undefined);

const STORAGE_KEY_THEME = "devflow_theme_v1";

interface DevFlowProviderProps {
  children: React.ReactNode;
  initialProjects?: Project[];
  initialTasks?: Task[];
}

export function DevFlowProvider({
  children,
  initialProjects = MOCK_PROJECTS,
  initialTasks = MOCK_TASKS,
}: DevFlowProviderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>("todo");
  const [defaultTaskProjectId, setDefaultTaskProjectId] = useState<string | undefined>(
    undefined
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedTheme =
        (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || "light";
      setThemeState(savedTheme);
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let effectiveDark = false;

    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveDark = systemDark;
    } else {
      effectiveDark = theme === "dark";
    }

    if (effectiveDark) {
      root.classList.add("dark");
      setResolvedTheme("dark");
    } else {
      root.classList.remove("dark");
      setResolvedTheme("light");
    }

    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      return;
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const addProject = useCallback(
    (
      data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">
    ): Project => {
      const id = `proj-${Date.now()}`;
      const newProject: Project = {
        ...data,
        id,
        tasksCount: 0,
        completedTasks: 0,
        updatedAt: "Agora mesmo",
      };

      setProjects((prev) => [newProject, ...prev]);
      void createProjectAction({ ...data, id });

      return newProject;
    },
    []
  );

  const updateProject = useCallback(
    (
      id: string,
      data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
    ) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
              ...p,
              ...data,
              updatedAt: "Agora mesmo",
            }
            : p
        )
      );
      void updateProjectAction(id, data);
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    void deleteProjectAction(id);
  }, []);

  const addTask = useCallback((data: Omit<Task, "id" | "createdAt">): Task => {
    const id = `task-${Date.now()}`;
    const newTask: Task = {
      ...data,
      id,
      createdAt: "Hoje",
    };

    setTasks((prev) => [newTask, ...prev]);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === data.projectId) {
          return {
            ...p,
            tasksCount: p.tasksCount + 1,
            completedTasks:
              data.status === "done" ? p.completedTasks + 1 : p.completedTasks,
            updatedAt: "Agora mesmo",
          };
        }
        return p;
      })
    );

    void createTaskAction({ ...data, id });

    return newTask;
  }, []);

  const updateTask = useCallback(
    (taskId: string, data: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) => {
        const existing = prev.find((t) => t.id === taskId);
        if (!existing) return prev;

        const nextTask: Task = { ...existing, ...data };
        const updated = prev.map((t) => (t.id === taskId ? nextTask : t));

        const oldProjectId = existing.projectId;
        const newProjectId = nextTask.projectId;
        const wasDone = existing.status === "done";
        const isNowDone = nextTask.status === "done";

        setProjects((projList) =>
          projList.map((p) => {
            if (oldProjectId === newProjectId && p.id === oldProjectId) {
              const diff = isNowDone === wasDone ? 0 : isNowDone ? 1 : -1;
              return {
                ...p,
                completedTasks: Math.max(0, p.completedTasks + diff),
                updatedAt: "Agora mesmo",
              };
            }
            if (p.id === oldProjectId) {
              return {
                ...p,
                tasksCount: Math.max(0, p.tasksCount - 1),
                completedTasks: wasDone
                  ? Math.max(0, p.completedTasks - 1)
                  : p.completedTasks,
                updatedAt: "Agora mesmo",
              };
            }
            if (p.id === newProjectId) {
              return {
                ...p,
                tasksCount: p.tasksCount + 1,
                completedTasks: isNowDone
                  ? p.completedTasks + 1
                  : p.completedTasks,
                updatedAt: "Agora mesmo",
              };
            }
            return p;
          })
        );

        return updated;
      });

      void updateTaskAction(taskId, data);
    },
    []
  );

  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      setTasks((prev) => {
        let targetProjectId = "";
        let wasDone = false;
        const isNowDone = newStatus === "done";

        const updated = prev.map((t) => {
          if (t.id === taskId) {
            targetProjectId = t.projectId;
            wasDone = t.status === "done";
            return { ...t, status: newStatus };
          }
          return t;
        });

        if (targetProjectId && wasDone !== isNowDone) {
          setProjects((projList) =>
            projList.map((p) => {
              if (p.id === targetProjectId) {
                const diff = isNowDone ? 1 : -1;
                return {
                  ...p,
                  completedTasks: Math.max(0, p.completedTasks + diff),
                  updatedAt: "Agora mesmo",
                };
              }
              return p;
            })
          );
        }

        return updated;
      });

      void updateTaskStatusAction(taskId, newStatus);
    },
    []
  );

  const toggleTaskDone = useCallback((taskId: string) => {
    setTasks((prev) => {
      const current = prev.find((t) => t.id === taskId);
      if (!current) return prev;
      const nextStatus: TaskStatus = current.status === "done" ? "todo" : "done";
      const isNowDone = nextStatus === "done";

      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, status: nextStatus } : t
      );

      setProjects((projList) =>
        projList.map((p) => {
          if (p.id === current.projectId) {
            const diff = isNowDone ? 1 : -1;
            return {
              ...p,
              completedTasks: Math.max(0, p.completedTasks + diff),
              updatedAt: "Agora mesmo",
            };
          }
          return p;
        })
      );

      return updated;
    });

    void toggleTaskDoneAction(taskId);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      const updated = prev.filter((t) => t.id !== taskId);

      if (target) {
        setProjects((projList) =>
          projList.map((p) => {
            if (p.id === target.projectId) {
              return {
                ...p,
                tasksCount: Math.max(0, p.tasksCount - 1),
                completedTasks:
                  target.status === "done"
                    ? Math.max(0, p.completedTasks - 1)
                    : p.completedTasks,
                updatedAt: "Agora mesmo",
              };
            }
            return p;
          })
        );
      }

      return updated;
    });

    void deleteTaskAction(taskId);
  }, []);

  const openCreateTaskModal = useCallback(
    (status: TaskStatus = "todo", projectId?: string) => {
      setEditingTask(null);
      setDefaultTaskStatus(status);
      setDefaultTaskProjectId(projectId);
      setIsTaskModalOpen(true);
    },
    []
  );

  const openEditTaskModal = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultTaskStatus(task.status);
    setDefaultTaskProjectId(task.projectId);
    setIsTaskModalOpen(true);
  }, []);

  const closeCreateTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultTaskProjectId(undefined);
  }, []);

  const openCreateProjectModal = useCallback(() => {
    setIsProjectModalOpen(true);
  }, []);

  const closeCreateProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      projects,
      addProject,
      updateProject,
      deleteProject,
      tasks,
      addTask,
      updateTask,
      updateTaskStatus,
      toggleTaskDone,
      deleteTask,
      isTaskModalOpen,
      defaultTaskStatus,
      defaultTaskProjectId,
      editingTask,
      openCreateTaskModal,
      openEditTaskModal,
      closeCreateTaskModal,
      isProjectModalOpen,
      openCreateProjectModal,
      closeCreateProjectModal,
    }),
    [
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      projects,
      addProject,
      updateProject,
      deleteProject,
      tasks,
      addTask,
      updateTask,
      updateTaskStatus,
      toggleTaskDone,
      deleteTask,
      isTaskModalOpen,
      defaultTaskStatus,
      defaultTaskProjectId,
      editingTask,
      openCreateTaskModal,
      openEditTaskModal,
      closeCreateTaskModal,
      isProjectModalOpen,
      openCreateProjectModal,
      closeCreateProjectModal,
    ]
  );

  return (
    <DevFlowContext.Provider value={value}>
      {children}
    </DevFlowContext.Provider>
  );
}

export function useDevFlow() {
  const context = useContext(DevFlowContext);
  if (!context) {
    throw new Error("useDevFlow must be used within a DevFlowProvider");
  }
  return context;
}
