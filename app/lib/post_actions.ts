"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const VALID_ACTIONS = [1, -1]

export async function upsertPostAction({ 
    action, post_id 
}: {
    action: number, post_id: string 
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && VALID_ACTIONS.includes(action)) {
        await supabase.from("post_action").upsert({
            action: action,
            post_id: post_id,
            user_id: user.id,
        })
    }
    revalidatePath('/posts')
}

export async function deletePostAction({ 
    action, post_id 
}: {
    action: number, post_id: string 
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && VALID_ACTIONS.includes(action)) {
        await supabase.from("post_action")
                .delete()
                .eq('action', action)
                .eq('post_id', post_id)
                .eq('user_id', user.id)
    }
    revalidatePath('/posts')
}