"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_ITEMS, NavItem } from "@/config/navigation";
import {
  DashboardIcon,
  ProjectsIcon,
  TasksIcon,
  KanbanIcon,
  SettingsIcon,
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50/50 flex flex-col justify-between p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-base shadow dark:bg-white dark:text-zinc-900">
            D
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              DevFlow
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Workspace</p>
          </div>
        </div>

        {/* Navigation Items consumindo config/navigation */}
        <nav className="space-y-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = ICON_MAP[item.iconName];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center border border-emerald-500/30">
            DF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
              Paulo Developer
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              paulo@devflow.io
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
