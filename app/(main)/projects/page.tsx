import { queryProjects } from "@/app/lib/projects";
import AddProject from "@/app/ui/add-projects";
import ProjectsList from "@/app/ui/projects-list";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectsDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", "/projects");
    redirect(`/login?${searchParams.toString()}`);
  }
  const projects = await queryProjects(user.id);
  if (!projects) {
    return <p>Aint loaded boy</p>;
  }
  return (
    <div className="px-1 max-w-4xl w-full flex flex-col gap-y-4">
      <p className="font-bold text-3xl">Your Projects</p>
      <AddProject userId={user.id} hasNoProjects={!projects.length} />
      <ProjectsList projects={projects} />
    </div>
  );
}
