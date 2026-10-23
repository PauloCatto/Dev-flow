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
  // Theme
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Projects
  projects: Project[];
  addProject: (
    data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">
  ) => Project;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "createdAt">) => Task;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleTaskDone: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  // Modals
  isTaskModalOpen: boolean;
  defaultTaskStatus: TaskStatus;
  openCreateTaskModal: (status?: TaskStatus) => void;
  closeCreateTaskModal: () => void;

  isProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
}

const DevFlowContext = createContext<DevFlowContextType | undefined>(undefined);

const STORAGE_KEY_PROJECTS = "devflow_projects_v1";
const STORAGE_KEY_TASKS = "devflow_tasks_v1";
const STORAGE_KEY_THEME = "devflow_theme_v1";

export function DevFlowProvider({ children }: { children: React.ReactNode }) {
  // Initial state seeds
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>("todo");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Hydrate from localStorage on client mount
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

      const savedTheme = (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || "light";
      setThemeState(savedTheme);
    } catch {
      // Fallback silently if storage is disabled/inaccessible
    }
  }, []);

  // Sync theme changes with DOM
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
      // Ignore
    }
  }, [theme]);

  // Persist projects
  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(newProjects));
    } catch {
      // Ignore
    }
  }, []);

  // Persist tasks
  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(newTasks));
    } catch {
      // Ignore
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  // Add Project
  const addProject = useCallback(
    (data: Omit<Project, "id" | "tasksCount" | "completedTasks" | "updatedAt">): Project => {
      const newProject: Project = {
        ...data,
        id: `proj-${Date.now()}`,
        tasksCount: 0,
        completedTasks: 0,
        updatedAt: "Agora mesmo",
      };

      setProjects((prev) => {
        const updated = [newProject, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
        } catch {
          // Ignore
        }
        return updated;
      });

      return newProject;
    },
    []
  );

  // Delete Project
  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Add Task
  const addTask = useCallback(
    (data: Omit<Task, "id" | "createdAt">): Task => {
      const newTask: Task = {
        ...data,
        id: `task-${Date.now()}`,
        createdAt: "Hoje",
      };

      setTasks((prev) => {
        const updated = [newTask, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
        } catch {
          // Ignore
        }
        return updated;
      });

      // Update project counts
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

      return newTask;
    },
    []
  );

  // Move / Update Task Status
  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
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

      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      } catch {
        // Ignore
      }

      // Sync project completedTasks count if status changed to/from done
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
  }, []);

  // Toggle Task Done (Checkbox)
  const toggleTaskDone = useCallback((taskId: string) => {
    setTasks((prev) => {
      const current = prev.find((t) => t.id === taskId);
      if (!current) return prev;
      const nextStatus: TaskStatus = current.status === "done" ? "todo" : "done";
      return prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t));
    });
  }, []);

  // Delete Task
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      const updated = prev.filter((t) => t.id !== taskId);
      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      } catch {
        // Ignore
      }

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
  }, []);

  // Modal helpers
  const openCreateTaskModal = useCallback((status: TaskStatus = "todo") => {
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  }, []);

  const closeCreateTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
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
      deleteProject,
      tasks,
      addTask,
      updateTaskStatus,
      toggleTaskDone,
      deleteTask,
      isTaskModalOpen,
      defaultTaskStatus,
      openCreateTaskModal,
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
      deleteProject,
      tasks,
      addTask,
      updateTaskStatus,
      toggleTaskDone,
      deleteTask,
      isTaskModalOpen,
      defaultTaskStatus,
      openCreateTaskModal,
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
