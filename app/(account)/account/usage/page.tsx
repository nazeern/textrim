import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UsageCard from "@/app/ui/usage-card";
import { currencyString } from "@/app/lib/utils";
import ProjectRow from "@/app/ui/project-row";
import ProjectsList from "@/app/ui/projects-list";
import { queryUsage } from "@/app/lib/profiles";

export default async function UsagePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const usageData = await queryUsage(user.id);
  if (!usageData) {
    return <p>Problem fetching usage data. We are working to resolve this.</p>;
  }

  return (
    <>
      <p className="text-4xl font-semibold mb-4">Usage</p>
      <div className="w-full flex flex-col gap-y-4 rounded-md bg-gray-100 p-4">
        <div className="flex gap-x-4">
          <UsageCard
            label="Total Minutes Transcribed"
            value={usageData.totalMinutesTranscribed}
          />
          <UsageCard
            label="Total Cost"
            value={currencyString(usageData.totalCost)}
          />
        </div>
        <div className="max-w-2/3 p-4 border rounded-3xl bg-white">
          <p className="font-bold text-2xl mb-4">Top Projects</p>
          <ProjectsList projects={usageData.topProjects} excludeLink={true} />
        </div>
      </div>
    </>
  );
}
