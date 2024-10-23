import { signup } from "@/app/lib/actions";
import Link from "next/link";
import { LogoTitle } from "@/app/ui/logo";
import Toast from "@/app/ui/toast";
import FormButton from "@/app/ui/form-button";
import GoogleButton from "@/app/ui/google-button";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
    redirectTo?: string;
  };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/projects");
  }
  const error = searchParams?.error
    ? decodeURIComponent(searchParams?.error)
    : null;
  const redirectTo = searchParams?.redirectTo;

  return (
    <>
      <div id="logo" className="mb-4">
        <LogoTitle />
      </div>
      <div className="min-w-96 w-4/12 bg-white rounded-lg shadow p-10 border">
        <Toast style="error">{error}</Toast>
        <p className="text-2xl font-bold mb-6">Create an account</p>
        {/* Sign in with Google */}
        <div className="flex justify-center">
          <GoogleButton />
        </div>
        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-4 text-gray-500">or</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        {/* Email & Password */}
        <form className="flex flex-col gap-y-2">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <label htmlFor="name" className="">
            First Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <input
            id="redirectTo"
            name="redirectTo"
            value={redirectTo}
            type="hidden"
          />
          <FormButton action={signup} loadingText="Signing up...">
            Sign Up
          </FormButton>
          <p className="text-sm font-light text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
