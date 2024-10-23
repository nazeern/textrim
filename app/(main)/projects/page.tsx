import { queryProjects } from "@/app/lib/projects";
import AddProject from "@/app/ui/add-projects";
import ProjectsList from "@/app/ui/projects-list";
import { createClient } from "@/utils/supabase/server";

export default async function ProjectsDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <p>Ya aint logged in boi</p>;
  }
  const projects = await queryProjects(user.id);
  if (!projects) {
    return <p>Aint loaded boy</p>;
  }
  return (
    <div className="px-1 max-w-4xl w-full flex flex-col gap-y-4">
      <p className="font-bold text-3xl">Your Projects</p>
      <AddProject userId={user.id} hasNoProjects={!projects.length} />
      <ProjectsList userId={user.id} projects={projects} />
    </div>
  );
}
