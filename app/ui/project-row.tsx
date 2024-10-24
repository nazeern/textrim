import { Project } from "@/app/lib/projects";
import Link from "next/link";

export default async function ProjectRow({
  project,
  excludeLink = false,
}: {
  project: Project;
  excludeLink?: boolean;
}) {
  return (
    <tr className="border border-primary text-lg">
      <td className="italic text-lg">{project.name}</td>
      <td>{project.createdAt}</td>
      <td>{project.totalMinutesTranscribed}</td>
      {!excludeLink && (
        <td>
          <Link
            className="rounded-lg bg-primary text-onprimary p-2 hover:bg-primaryhov transition-transform hover:-translate-y-1"
            href={`/projects/${project.encodedId}`}
          >
            Go &rarr;
          </Link>
        </td>
      )}
    </tr>
  );
}
