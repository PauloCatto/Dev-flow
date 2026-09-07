import { MOCK_PROJECTS } from "@/lib/mock-data";
import { ProjectsList } from "@/components/projects/projects-list";

export default function ProjectsPage() {
  return <ProjectsList initialProjects={MOCK_PROJECTS} />;
}
