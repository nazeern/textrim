import { signup } from "@/app/lib/actions";
import Link from "next/link";
import { LogoTitle } from "@/app/ui/logo";
import Toast from "@/app/ui/toast";
import FormButton from "@/app/ui/form-button";

export default function SignupPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
    redirectTo?: string;
  };
}) {
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
        <form className="flex flex-col gap-y-2">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <label htmlFor="username" className="">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
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
            required
            className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <label htmlFor="confirm-password" className="">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <div className="flex items-center gap-x-1 mb-3">
            <input
              id="terms"
              aria-describedby="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-primary"
              required
            />
            <label htmlFor="terms" className="font-light text-sm text-gray-500">
              I accept the{" "}
              <Link
                className="font-medium text-primary hover:underline"
                href="/terms"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
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
