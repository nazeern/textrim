import { Project } from "@/app/lib/projects";
import Link from "next/link";

export default async function ProjectRow({ project }: { project: Project }) {
  return (
    <tr className="border-b border-primary">
      <td className="italic py-4 text-lg">{project.name}</td>
      <td>{project.createdAt}</td>
      <td>
        <Link
          className="rounded-lg bg-primary text-onprimary p-2 hover:bg-primaryhov transition-transform hover:-translate-y-1"
          href={`/projects/${project.encodedId}`}
        >
          Go &rarr;
        </Link>
      </td>
    </tr>
  );
}
