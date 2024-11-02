"use client";

import { User } from "@supabase/auth-js";
import { unsubscribeUser } from "../lib/stripe";

export default function ClientButton({
  children,
  user,
}: {
  children: JSX.Element | string;
  user: User;
}) {
  return (
    <button
      onClick={() => unsubscribeUser(user)}
      className="text-sm font-semibold leading-6 bg-gray-200 py-1 px-2 rounded-lg hover:bg-gray-300"
    >
      {children}
    </button>
  );
}
