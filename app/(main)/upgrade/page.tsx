import AcceptPayment from "@/app/ui/accept-payment";
import PlanCard, { Plan } from "@/app/ui/plan-card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const planString = searchParams.plan;
  if (!user) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", `/upgrade?plan=${planString}`);
    redirect("/sign-up");
  }
  const plan = Plan.fromPlanString(planString);
  if (plan == Plan.FREE) {
    redirect("/projects");
  }
  return (
    <div className="w-full max-w-3xl flex md:flex-row flex-col gap-12 px-1">
      <PlanCard plan={plan} userId={user?.id} />
      <AcceptPayment user={user} plan={plan} />
    </div>
  );
}
