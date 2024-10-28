"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LoadingDots from "./loading_dots";
import { login, signup } from "../lib/actions";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Plan } from "./plan-card";

export default function ProfileIcon({
  initial,
  plan,
}: {
  initial?: string;
  plan: Plan;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    <LoadingDots />;
  }

  // User not logged in
  if (!initial) {
    const loginSearchParams = new URLSearchParams();
    loginSearchParams.set("redirectTo", "/projects");

    const signupSearchParams = new URLSearchParams();
    signupSearchParams.set(
      "redirectTo",
      `/login?${loginSearchParams.toString()}`
    );
    return (
      <div className="flex gap-x-3">
        <Link
          href={`/login?${loginSearchParams.toString()}`}
          className="text-sm font-semibold leading-6 text-primary py-1 px-2 border border-primary rounded-lg hover:border-blue-300"
        >
          Log in
        </Link>
        <Link
          href={`/sign-up?${signupSearchParams.toString()}`}
          className="text-sm font-semibold leading-6 bg-blue-600 text-onprimary py-1 px-2 border border-blue-500 rounded-lg hover:bg-primary hover:border-blue-400"
        >
          Start Editing
        </Link>
      </div>
    );
  }

  // Logged in user, on editor
  if (pathname.startsWith("/projects")) {
    return (
      <div className="flex gap-x-12 items-center">
        {plan == Plan.FREE && (
          <Link
            onClick={() => setIsLoading(true)}
            href="/pricing"
            className="flex items-center gap-x-2 border bg-purple-500 rounded-md
            text-onprimary hover:border-complement px-2 py-1"
          >
            Upgrade
            <BoltIcon className="stroke-onprimary size-3" />
          </Link>
        )}
        <Link
          onClick={() => setIsLoading(true)}
          href="/account"
          className="flex justify-center items-center border border-primary bg-blue-100 rounded-full size-10
            text-primary hover:border-complement"
        >
          {initial}
        </Link>
      </div>
    );
  } else {
    return (
      <Link
        href="/projects"
        className="text-sm font-semibold leading-6 bg-blue-600 text-onprimary py-1 px-2 border border-blue-500 rounded-lg hover:bg-primary hover:border-blue-400"
      >
        Your Dashboard
      </Link>
    );
  }
}
