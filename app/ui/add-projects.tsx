import { insertProject, Project } from "@/app/lib/projects";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default async function AddProject({ userId }: { userId: string }) {
  return (
    <form className="flex gap-x-4 rounded-lg bg-primarybg border border-primary p-4">
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Project Name"
        className="p-2 border-primary rounded-lg font-bold"
      />
      <input
        type="hidden"
        id="userId"
        name="userId"
        value={userId}
        className=""
      />
      <button
        formAction={insertProject}
        className="flex items-center gap-x-1 bg-primary text-onprimary text-sm p-2 rounded-lg"
      >
        Add Project
        <PlusCircleIcon className="size-5" />
      </button>
    </form>
  );
}
