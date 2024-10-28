import AcceptPayment from "@/app/ui/accept-payment";
import { Plan } from "@/app/ui/plan-card";
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
  return <AcceptPayment user={user} plan={plan} />;
}
