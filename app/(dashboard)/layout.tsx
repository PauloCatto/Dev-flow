import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { DevFlowProvider } from "@/context/devflow-context";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { getInitialWorkspaceData } from "@/app/actions/devflow";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialProjects = MOCK_PROJECTS;
  let initialTasks = MOCK_TASKS;

  try {
    const data = await getInitialWorkspaceData();
    initialProjects = data.projects;
    initialTasks = data.tasks;
  } catch {
    initialProjects = MOCK_PROJECTS;
    initialTasks = MOCK_TASKS;
  }

  return (
    <DevFlowProvider
      initialProjects={initialProjects}
      initialTasks={initialTasks}
    >
      <div className="flex min-h-screen bg-zinc-100 dark:bg-black font-sans antialiased text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <CreateTaskModal />
    </DevFlowProvider>
  );
}
