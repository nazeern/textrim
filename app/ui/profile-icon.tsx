"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LoadingDots from "./loading_dots";
import { login, signup } from "../lib/actions";

export default function ProfileIcon({ initial }: { initial?: string }) {
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
    signupSearchParams.set("redirectTo", `/login`);
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

  // User logged in
  if (pathname.startsWith("/projects")) {
    return (
      <Link
        onClick={() => setIsLoading(true)}
        href="/account"
        className="border border-primary bg-blue-100 rounded-full size-10 text-center align-middle pt-2
            text-primary hover:border-complement"
      >
        {initial}
      </Link>
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
