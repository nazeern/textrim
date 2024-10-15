import Link from "next/link";
import { insertComment } from "../lib/comments";
import FormButton from "./form-button";

export default async function AddComment({
  unauth,
  postId,
  encodedPostId,
}: {
  unauth: boolean;
  postId: string;
  encodedPostId: string;
}) {
  if (unauth) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", `/posts/${encodedPostId}`);

    return (
      <div className="min-w-96 w-6/12 p-4 rounded-3xl shadow border border-primary mb-4">
        <div className="relative">
          <div
            className="absolute backdrop-blur-[1px] -inset-1 rounded-lg
            flex flex-col justify-center items-center"
          >
            <Link
              className="rounded-full bg-primary px-10 py-2.5 text-sm font-semibold text-white shadow-sm 
            hover:bg-primaryhov border-2 hover:border-complement transition hover:-translate-y-1"
              href={`/sign-up?${searchParams.toString()}`}
            >
              Sign Up &rarr;
            </Link>
            <p className="mt-2 font-light">
              Sign up for free to post comments!
            </p>
          </div>
          <input id="postId" name="postId" value={postId} type="hidden" />
          <textarea
            id="body"
            name="body"
            placeholder="Your Comment Here..."
            required
            className="w-full bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-2"
          />
        </div>
      </div>
    );
  } else {
    return (
      <form className="min-w-96 w-6/12 p-4 rounded-3xl shadow border border-primary mb-4">
        <input id="postId" name="postId" value={postId} type="hidden" />
        <textarea
          id="body"
          name="body"
          placeholder="Your Comment Here..."
          required
          className="w-full bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-2"
        />
        <FormButton
          className="-mb-0"
          action={insertComment}
          loadingText="Adding Comment..."
        >
          Add Comment
        </FormButton>
      </form>
    );
  }
}
