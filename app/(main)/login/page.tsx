import { login } from "@/app/lib/actions";
import Link from "next/link";
import { LogoTitle } from "@/app/ui/logo";
import Toast from "@/app/ui/toast";
import FormButton from "@/app/ui/form-button";

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    success?: string;
    error?: string;
    redirectTo?: string;
  };
}) {
  const success = searchParams?.success
    ? decodeURIComponent(searchParams?.success)
    : null;
  const error = searchParams?.error
    ? decodeURIComponent(searchParams?.error)
    : null;
  const toastStyle = success ? "success" : "error";
  const redirectTo = searchParams?.redirectTo;

  return (
    <>
      <div id="logo" className="mb-4">
        <LogoTitle />
      </div>
      <div className="min-w-96 w-4/12 bg-white rounded-lg shadow p-10 border">
        <Toast style={toastStyle}>{success || error}</Toast>
        <p className="text-2xl font-bold mb-6">Log in to your account</p>
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
          <input
            id="redirectTo"
            name="redirectTo"
            value={redirectTo}
            type="hidden"
          />
          <FormButton action={login} loadingText="Logging in...">
            Log In
          </FormButton>
          <p className="text-sm font-light text-gray-500">
            Need an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
