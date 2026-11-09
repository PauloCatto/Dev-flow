import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { DevFlowProvider } from "@/context/devflow-context";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { getInitialWorkspaceData } from "@/app/actions/devflow";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { Project, Task } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? verifySessionToken(token) : null;

  if (!user) {
    redirect("/login");
  }

  let initialProjects: Project[] = [];
  let initialTasks: Task[] = [];

  try {
    const data = await getInitialWorkspaceData();
    initialProjects = data.projects;
    initialTasks = data.tasks;
  } catch {
    initialProjects = [];
    initialTasks = [];
  }

  return (
    <DevFlowProvider
      key={user.id}
      currentUser={user}
      initialProjects={initialProjects}
      initialTasks={initialTasks}
    >
      <div className="flex min-h-screen bg-zinc-100 dark:bg-black font-sans antialiased text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <Sidebar user={user} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <CreateTaskModal />
    </DevFlowProvider>
  );
}
