import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UsageCard from "@/app/ui/usage-card";
import { currencyString } from "@/app/lib/utils";
import ProjectRow from "@/app/ui/project-row";
import ProjectsList from "@/app/ui/projects-list";
import { queryUsage } from "@/app/lib/profiles";
import Link from "next/link";
import { Plan } from "@/app/ui/plan-card";
import ClientButton from "@/app/ui/client-button";
import { unsubscribeUser } from "@/app/lib/stripe";

export default async function UsagePage() {
  const supabase = await createClient();
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
          {usageData.totalCost != null && (
            <UsageCard
              label="Total Cost"
              value={currencyString(usageData.totalCost)}
            />
          )}
        </div>
        <div className="max-w-2/3 p-4 border rounded-3xl bg-white">
          <p className="font-bold text-2xl mb-4">Top Projects</p>
          <ProjectsList projects={usageData.topProjects} excludeLink={true} />
        </div>
        <div className="w-full flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-white">
          <p className="text-lg">Current Plan</p>
          <div className="text-sm font-semibold leading-6 bg-primarybg text-primary py-1 px-2 border border-primary rounded-lg">
            {Plan.toPlanString(usageData.plan)}
          </div>
          <Link
            href="/pricing"
            className="ml-auto text-sm font-semibold leading-6 bg-blue-600 text-onprimary py-1 px-2 border border-blue-500 rounded-lg hover:bg-primary hover:border-blue-400"
          >
            Change Plan
          </Link>
          <ClientButton user={user}>Unsubscribe</ClientButton>
        </div>
      </div>
    </>
  );
}
