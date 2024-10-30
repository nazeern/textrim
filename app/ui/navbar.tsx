import Link from "next/link";
import { LogoTitle } from "./logo";
import { createClient } from "@/utils/supabase/server";
import ProfileIcon from "./profile-icon";
import NavTabs from "./nav-tabs";
import { getCurrentPlan } from "../lib/profiles";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const initial = user?.user_metadata.name[0];
  const { plan } = await getCurrentPlan(user?.id);

  return (
    <nav
      className="flex items-center justify-between p-4 lg:px-64 border-b"
      aria-label="Global"
    >
      <div id="logo" className="flex gap-x-12 items-end">
        <LogoTitle />
        <NavTabs />
      </div>
      <ProfileIcon initial={initial} plan={plan} />
    </nav>
  );
}
