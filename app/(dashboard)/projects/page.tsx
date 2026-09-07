import { MOCK_PROJECTS } from "@/lib/mock-data";
import { ProjectsList } from "@/components/projects/projects-list";

export default function ProjectsPage() {
  // Server Component: busca ou recebe os dados iniciais e repassa para a View interativa do cliente
  return <ProjectsList initialProjects={MOCK_PROJECTS} />;
}
