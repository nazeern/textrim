"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs({ initial }: { initial?: string }) {
  const pathname = usePathname();

  // Not on editor
  if (!pathname.startsWith("/projects")) {
    return (
      <Link
        href="/pricing"
        className="hidden md:block font-semibold hover:text-primary mb-[2.5px]"
      >
        Pricing
      </Link>
    );
  } else {
    return null;
  }
}
