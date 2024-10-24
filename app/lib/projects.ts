'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateCost, round, timestampString } from "./utils"
import { encodeBase64UUID } from "./string"
import { Duration } from "./classes"

export type Project = {
    encodedId: string,
    name: string,
    createdAt: string,
    totalMinutesTranscribed?: number,
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

export type UsageData = {
    totalMinutesTranscribed: number,
    totalCost: number,
    topProjects: Project[],
}

export async function queryUsage(userId: string): Promise<UsageData | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            name,
            created_at,
            videos (duration)
        `)
        .eq('user_id', userId)
    if (!data) { return null }

    const topProjects = data.map((proj) => ({
        encodedId: encodeBase64UUID(proj.id),
        name: proj.name,
        createdAt: timestampString(proj.created_at),
        totalMinutesTranscribed: round(
            Duration.fromDB(
                proj.videos.reduce((acc, video) => {
                    return acc + video.duration
                }, 0)
            ) / 60,
        ),
    }))
    const totalMinutesTranscribed = topProjects?.reduce((acc, proj) => {
        return acc + proj.totalMinutesTranscribed
    }, 0)

    return {
        totalMinutesTranscribed: round(totalMinutesTranscribed),
        totalCost: calculateCost(totalMinutesTranscribed),
        topProjects: topProjects,
    }
}
