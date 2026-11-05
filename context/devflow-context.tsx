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

const STORAGE_KEY_PROJECTS = "devflow_projects_v1";
const STORAGE_KEY_TASKS = "devflow_tasks_v1";
const STORAGE_KEY_THEME = "devflow_theme_v1";

function persistToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function DevFlowProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
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
      const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }

      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

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
      const newProject: Project = {
        ...data,
        id: `proj-${Date.now()}`,
        tasksCount: 0,
        completedTasks: 0,
        updatedAt: "Agora mesmo",
      };

      setProjects((prev) => {
        const updated = [newProject, ...prev];
        persistToStorage(STORAGE_KEY_PROJECTS, updated);
        return updated;
      });

      return newProject;
    },
    []
  );

  const updateProject = useCallback(
    (
      id: string,
      data: Partial<Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">>
    ) => {
      setProjects((prev) => {
        const updated = prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...data,
                updatedAt: "Agora mesmo",
              }
            : p
        );
        persistToStorage(STORAGE_KEY_PROJECTS, updated);
        return updated;
      });
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persistToStorage(STORAGE_KEY_PROJECTS, updated);
      return updated;
    });

    setTasks((prev) => {
      const updated = prev.filter((t) => t.projectId !== id);
      persistToStorage(STORAGE_KEY_TASKS, updated);
      return updated;
    });
  }, []);

  const addTask = useCallback((data: Omit<Task, "id" | "createdAt">): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: "Hoje",
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      persistToStorage(STORAGE_KEY_TASKS, updated);
      return updated;
    });

    setProjects((prev) => {
      const updated = prev.map((p) => {
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
      });
      persistToStorage(STORAGE_KEY_PROJECTS, updated);
      return updated;
    });

    return newTask;
  }, []);

  const updateTask = useCallback(
    (taskId: string, data: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) => {
        const existing = prev.find((t) => t.id === taskId);
        if (!existing) return prev;

        const nextTask: Task = { ...existing, ...data };
        const updated = prev.map((t) => (t.id === taskId ? nextTask : t));
        persistToStorage(STORAGE_KEY_TASKS, updated);

        const oldProjectId = existing.projectId;
        const newProjectId = nextTask.projectId;
        const wasDone = existing.status === "done";
        const isNowDone = nextTask.status === "done";

        setProjects((projList) => {
          const updatedProjects = projList.map((p) => {
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
          });
          persistToStorage(STORAGE_KEY_PROJECTS, updatedProjects);
          return updatedProjects;
        });

        return updated;
      });
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

        persistToStorage(STORAGE_KEY_TASKS, updated);

        if (targetProjectId && wasDone !== isNowDone) {
          setProjects((projList) => {
            const updatedProjects = projList.map((p) => {
              if (p.id === targetProjectId) {
                const diff = isNowDone ? 1 : -1;
                return {
                  ...p,
                  completedTasks: Math.max(0, p.completedTasks + diff),
                  updatedAt: "Agora mesmo",
                };
              }
              return p;
            });
            persistToStorage(STORAGE_KEY_PROJECTS, updatedProjects);
            return updatedProjects;
          });
        }

        return updated;
      });
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
      persistToStorage(STORAGE_KEY_TASKS, updated);

      setProjects((projList) => {
        const updatedProjects = projList.map((p) => {
          if (p.id === current.projectId) {
            const diff = isNowDone ? 1 : -1;
            return {
              ...p,
              completedTasks: Math.max(0, p.completedTasks + diff),
              updatedAt: "Agora mesmo",
            };
          }
          return p;
        });
        persistToStorage(STORAGE_KEY_PROJECTS, updatedProjects);
        return updatedProjects;
      });

      return updated;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      const updated = prev.filter((t) => t.id !== taskId);
      persistToStorage(STORAGE_KEY_TASKS, updated);

      if (target) {
        setProjects((projList) => {
          const updatedProjects = projList.map((p) => {
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
          });
          persistToStorage(STORAGE_KEY_PROJECTS, updatedProjects);
          return updatedProjects;
        });
      }

      return updated;
    });
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
