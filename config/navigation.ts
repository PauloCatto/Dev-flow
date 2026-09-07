export interface NavItem {
  label: string;
  href: string;
  iconName: "dashboard" | "projects" | "tasks" | "kanban" | "settings";
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", iconName: "dashboard" },
  { label: "Projetos", href: "/projects", iconName: "projects" },
  { label: "Tarefas", href: "/tasks", iconName: "tasks" },
  { label: "Kanban", href: "/kanban", iconName: "kanban" },
  { label: "Configurações", href: "/settings", iconName: "settings" },
];
