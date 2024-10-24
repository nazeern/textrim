import { Project } from "@/app/lib/projects";
import ProjectRow from "./project-row";
import EmptyProjectRow from "./empty-project-row";

export default async function ProjectsList({
  projects,
  excludeLink = false,
}: {
  projects: Project[] | null;
  excludeLink?: boolean;
}) {
  return (
    <>
      <table className="w-full table-auto border-separate border-spacing-y-4">
        <thead className="font-bold text-lg">
          <tr>
            <td>Project Name</td>
            <td>Created On</td>
            {projects?.[0]?.totalMinutesTranscribed && (
              <td>Minutes Transcribed</td>
            )}
          </tr>
        </thead>
        {projects?.map((proj) => (
          <ProjectRow
            key={proj.encodedId}
            project={proj}
            excludeLink={excludeLink}
          />
        ))}
        <EmptyProjectRow />
      </table>
    </>
  );
}
