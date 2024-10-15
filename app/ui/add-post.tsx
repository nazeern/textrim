import { insertPost } from "@/app/lib/posts";
import FormButton from "./form-button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AddPost() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", "/posts");

    return (
      <div className="min-w-96 w-6/12 bg-white rounded-3xl shadow p-10 border border-complement bg-opacity-25 mb-4">
        <p className="text-2xl font-bold mb-4">Have a great idea?</p>
        <div className="relative">
          <div
            className="absolute backdrop-blur-[1px] -inset-1 rounded-lg
            flex flex-col justify-center items-center"
          >
            <Link
              className="rounded-full bg-primary px-10 py-2.5 text-sm font-semibold text-white shadow-sm 
            hover:bg-primarylight border-2 hover:border-complement transition hover:-translate-y-1"
              href={`/sign-up?${searchParams.toString()}`}
            >
              Sign Up &rarr;
            </Link>
            <p className="mt-2 font-light">
              Sign up for free to share ideas and get community feedback!
            </p>
          </div>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Post Title..."
            required
            className="block w-full bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <textarea
            id="body"
            name="body"
            placeholder="Your Idea Here..."
            required
            className="block w-full h-36 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-w-96 w-6/12 bg-white rounded-3xl shadow p-10 border border-complement bg-opacity-25 mb-4">
        <p className="text-2xl font-bold mb-4">Have a great idea?</p>
        <form>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Post Title..."
            required
            className="block w-full bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <textarea
            id="body"
            name="body"
            placeholder="Your Idea Here..."
            required
            className="block w-full h-36 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <FormButton action={insertPost} loadingText="Posting...">
            Post
          </FormButton>
        </form>
      </div>
    );
  }
}
