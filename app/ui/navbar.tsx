import Link from "next/link";
import { LogoTitle } from "./logo";
import { createClient } from "@/utils/supabase/server";
import ProfileIcon from "./profile-icon";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const initial = user?.user_metadata.name[0];

  return (
    <nav
      className="flex items-center justify-between p-4 lg:px-64 border-b"
      aria-label="Global"
    >
      <div id="logo">
        <LogoTitle />
      </div>
      <ProfileIcon initial={initial} />
    </nav>
  );
}
