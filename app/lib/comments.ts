'use server'

import { createClient } from "@/utils/supabase/server";
import { Tables } from "./types";
import { revalidatePath } from "next/cache";
import { encodeBase64UUID } from "./string";

export async function selectComments(): Promise<Tables<'comments'>[] | null> {
    const supabase = createClient()

    const { data } = await supabase.from("comments")
        .select("*", { count: 'estimated' })

    return data
}

export async function insertComment(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const postId = formData.get('postId') as string
    const body = formData.get('body') as string
    if (user) {
        await supabase.from("comments").insert({
            post_id: postId,
            user_id: user.id,
            body: body,
        })
    }
    revalidatePath('/posts/' + encodeBase64UUID(postId))
}

export async function deletePost() {
    return;
}