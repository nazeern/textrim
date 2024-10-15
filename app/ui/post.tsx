"use client";

import { LightBulbIcon, BoltSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { deletePostAction, upsertPostAction } from "../lib/post_actions";
import { ResolvedPost } from "../lib/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Post({
  key,
  post,
  unauth,
}: {
  key: string;
  post: ResolvedPost;
  unauth: boolean;
}) {
  const router = useRouter();
  const [postState, setPostState] = useState(post);

  return (
    <div
      className="flex flex-col border border-primary shadow rounded-3xl p-8 hover:border-complement transition hover:-translate-y-1"
      key={postState.id}
    >
      <Link href={`/posts/${postState.encodedId}`}>
        <p className="text-lg md:text-xl font-semibold min-w-0">
          {postState.title}
        </p>
        <p
          className="text-ellipsis overflow-y-hidden line-clamp-2
              text-sm md:text-base"
        >
          {postState.body}
        </p>
      </Link>
      <div className="flex gap-x-2 mt-auto pt-6 -mb-2 items-center">
        <button
          className="flex gap-x-1 rounded-xl hover:bg-orange-100 p-1"
          onClick={optimisticLikeUpdate}
        >
          <LightBulbIcon
            className={clsx("w-6", {
              "text-primary": postState.userLikedPost,
            })}
          />
          <p>{postState.countLikes}</p>
        </button>
        <button
          className="flex gap-x-1 rounded-xl hover:bg-blue-100 p-1"
          onClick={optimisticDislikeUpdate}
        >
          <BoltSlashIcon
            className={clsx("w-6", {
              "text-complement": postState.userDislikedPost,
            })}
          />
          <p>{postState.countDislikes}</p>
        </button>

        <p className="ml-auto font-light text-sm mt-1">By {postState.author}</p>
        <div
          className="border border-primary bg-yellow-100 rounded-full size-8 text-center pt-1
                  text-primary hover:border-complement"
        >
          {postState.author[0]}
        </div>
      </div>
    </div>
  );

  async function optimisticLikeUpdate(e: React.MouseEvent<HTMLButtonElement>) {
    if (unauth) {
      const searchParams = new URLSearchParams();
      searchParams.set("redirectTo", "/posts");
      router.push(`/sign-up?${searchParams.toString()}`);
    } else {
      let sign = 0;
      if (postState.userLikedPost) {
        sign = -1;
      } else {
        sign = 1;
      }
      setPostState({
        ...postState,
        countLikes: postState.countLikes + sign,
        userLikedPost: !postState.userLikedPost,
        ...(postState.userDislikedPost && {
          countDislikes: postState.countDislikes - 1,
          userDislikedPost: false,
        }),
      });
      if (sign == -1) {
        await deletePostAction({ action: 1, post_id: postState.id });
      } else {
        await upsertPostAction({ action: 1, post_id: postState.id });
      }
    }
  }

  async function optimisticDislikeUpdate(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    if (unauth) {
      const searchParams = new URLSearchParams();
      searchParams.set("redirectTo", "/posts");
      router.push(`/sign-up?${searchParams.toString()}`);
    } else {
      let sign = 0;
      if (postState.userDislikedPost) {
        sign = -1;
      } else {
        sign = 1;
      }
      setPostState({
        ...postState,
        countDislikes: postState.countDislikes + sign,
        userDislikedPost: !postState.userDislikedPost,
        ...(postState.userLikedPost && {
          countLikes: postState.countLikes - 1,
          userLikedPost: false,
        }),
      });
      if (sign == -1) {
        await deletePostAction({ action: -1, post_id: postState.id });
      } else {
        await upsertPostAction({ action: -1, post_id: postState.id });
      }
    }
  }
}
