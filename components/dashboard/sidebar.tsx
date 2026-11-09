"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_ITEMS, NavItem } from "@/config/navigation";
import { AuthUser } from "@/types";
import { logoutAction } from "@/app/actions/auth";
import {
  DashboardIcon,
  ProjectsIcon,
  TasksIcon,
  KanbanIcon,
  SettingsIcon,
  SidebarToggleIcon,
  LogoutIcon,
} from "@/components/icons";

const ICON_MAP: Record<
  NavItem["iconName"],
  (props: { className?: string }) => React.ReactNode
> = {
  dashboard: DashboardIcon,
  projects: ProjectsIcon,
  tasks: TasksIcon,
  kanban: KanbanIcon,
  settings: SettingsIcon,
};

interface SidebarProps {
  user?: AuthUser | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayName = user?.name || "Paulo Developer";
  const displayEmail = user?.email || "paulo@devflow.io";
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={`border-r border-zinc-200 bg-zinc-50/50 flex flex-col justify-between transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 ${
        isCollapsed ? "w-[72px] p-3" : "w-64 p-4"
      }`}
    >
      <div className="space-y-6">
        <div
          className={`flex items-center ${
            isCollapsed ? "flex-col gap-3 justify-center" : "justify-between px-2"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-base shadow dark:bg-white dark:text-zinc-900">
              D
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                  DevFlow
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {user?.role || "Workspace"}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            <SidebarToggleIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = ICON_MAP[item.iconName];

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`group flex items-center rounded-lg py-2 text-sm font-medium transition-all ${
                  isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                } ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive
                      ? "text-white dark:text-zinc-900"
                      : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <div
          className={`flex items-center justify-between rounded-lg py-1.5 transition-colors ${
            isCollapsed ? "flex-col gap-2 px-1" : "gap-2 px-2"
          }`}
          title={isCollapsed ? `${displayName} (${displayEmail})` : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center border border-emerald-500/30">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {displayEmail}
                </p>
              </div>
            )}
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sair da conta"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
