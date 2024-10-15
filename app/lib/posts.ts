'use server'

import { createClient } from "@/utils/supabase/server";
import { Tables } from "./types";
import { revalidatePath } from "next/cache";
import { encodeBase64UUID, decodeBase64UUID } from "./string";
import { QueryData } from "@supabase/supabase-js";

export type ResolvedPost = Tables<'posts'> & {
    encodedId: string
    countLikes: number
    countDislikes: number
    author: string
    userLikedPost: boolean
    userDislikedPost: boolean
}

export async function selectPosts(): Promise<ResolvedPost[] | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    let postsQuery = supabase.from("posts")
        .select("*, profiles!posts_user_id_fkey(username), post_action(action)")
    if (userId) { postsQuery = postsQuery.eq("post_action.user_id", userId) }

    const likesQuery = supabase.from("post_action")
        .select("post_id, post_id.count()")
        .eq("action", 1)
    const dislikesQuery = supabase.from("post_action")
        .select("post_id, post_id.count()")
        .eq("action", -1);

    return Promise.all([postsQuery, likesQuery, dislikesQuery])
        .then(([ postsResponse, likesResponse, dislikesResponse ]) => {
            return postsResponse.data?.map(({post_action, profiles, ...post}) => ({
                ...post,
                encodedId: 
                    encodeBase64UUID(post.id),
                countLikes: 
                    likesResponse.data?.find(({ post_id }) => post_id === post.id)?.count ?? 0,
                countDislikes: 
                    dislikesResponse.data?.find(({ post_id }) => post_id === post.id)?.count ?? 0,
                author: profiles?.username ?? "deleted",
                userLikedPost: !!userId && post_action.some(({ action }) => action == 1),
                userDislikedPost: !!userId && post_action.some(({ action }) => action == -1),
            })) ?? null
        })
}

export async function insertPost(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const title = formData.get('title') as string
    const body = formData.get('body') as string
    if (user) {
        await supabase.from("posts").insert({ 
            title, 
            body, 
            user_id: user.id 
        })
    }
    revalidatePath('/posts')
}

export async function deletePost() {
    return;
}

export async function selectPost(encodedId: string) {
    const postId = decodeBase64UUID(encodedId)

    const supabase = createClient()
    const postWithAuthorAndCommentsQuery = supabase.from("posts")
        .select("*, profiles!posts_user_id_fkey(username), comments(id, body, profiles(username))")
        .eq('id', postId)
        .single()
    type FullPost = QueryData<typeof postWithAuthorAndCommentsQuery> & {
        encodedId: string
    }
    const { data, error } = await postWithAuthorAndCommentsQuery

    if (!data) {
        return null
    } else {
        const postWithAuthorAndComments: FullPost = {
            ...data,
            encodedId
        }
        return postWithAuthorAndComments;
    }
}