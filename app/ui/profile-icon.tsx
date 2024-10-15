"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfileIcon({ initial }: { initial?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div
        className="border border-primary bg-yellow-100 rounded-full size-10 flex justify-center items-center
          text-primary hover:border-complement"
      >
        {/* Loading Dots */}
        <div className="flex gap-x-1">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    );
  } else if (!initial) {
    return (
      <Link
        href="/login"
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        Log in <span aria-hidden="true">&rarr;</span>
      </Link>
    );
  } else
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
}
