'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { timestampString } from "./utils"
import { encodeBase64UUID } from "./string"

export type Project = {
    encodedId: string,
    name: string,
    createdAt: string,
}

export async function queryProjects(userId: string): Promise<Project[] | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    if (error) {
        return null
    }
    return data.map((obj) => ({
        ...obj,
        encodedId: encodeBase64UUID(obj.id),
        createdAt: timestampString(obj.created_at)
    }))
}

export async function insertProject(formData: FormData): Promise<boolean> {

    const user_id = formData.get('userId') as string
    const name = formData.get('name') as string

    const supabase = createClient()
    const { error } = await supabase
        .from('projects')
        .insert({name, user_id})


    
    if (error) { 
        return false 
    } else { 
        revalidatePath('/projects')
        return true 
    }
}
