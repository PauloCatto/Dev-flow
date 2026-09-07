export type ProjectStatus = "Ativo" | "Em progresso" | "Planejado" | "Concluído";

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  lead: string;
  tasksCount: number;
  completedTasks: number;
  status: ProjectStatus;
  updatedAt: string;
}
