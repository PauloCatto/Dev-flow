export type TaskPriority = "baixa" | "media" | "alta" | "urgente";

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  createdAt: string;
}
