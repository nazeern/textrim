import { Project } from "@/app/lib/projects";
import ProjectRow from "./project-row";

export default async function ProjectsList({
  projects,
  userId,
}: {
  projects: Project[] | null;
  userId: string;
}) {
  return (
    <table className="w-full table-auto">
      <thead className="font-bold text-lg">
        <tr>
          <td>Project Name</td>
          <td>Created On</td>
        </tr>
      </thead>
      {projects?.map((proj) => (
        <ProjectRow key={proj.encodedId} project={proj} />
      ))}
    </table>
  );
}
