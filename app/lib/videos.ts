'use server'

import { Storage } from "@google-cloud/storage";
import { SpeechClient } from "@google-cloud/speech"
import { VideoData } from "@/app/MainEditor";
import { createClient } from "@/utils/supabase/server";
import { Duration } from "./classes";
import { changeExtension, ExportData, processVideoTranscript } from "./utils";

enum VideoDataStatus {
    UPLOADING,
    EXTRACTING,
    TRANSCRIBING,
    COMPLETE,
}

/** Get VideoData for a given project. */
export async function queryVideoData(projectId: string): Promise<VideoData[] | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('videos')
        .select('filename, transcript, position, duration')
        .eq('project_id', projectId)
        .order('position')

    if (data) {
        const handleDataPromises = data.map(async ({ filename, transcript, position, duration }) => ({
            id: filename,
            filename,
            position,
            transcript: transcript as WordInfo[],
            sourceUrl: await getVideoUrl(filename, "read"),
            duration: Duration.fromDB(duration),
            status: VideoDataStatus.COMPLETE,
        }))
        return await Promise.all(handleDataPromises)
    } else {
        return null
    }
}

export async function upsertVideoData(projectId: string, videoData: VideoData[]) {
    const supabase = await createClient()

    const toUpsert = videoData
        .map((vd) => ({
            project_id: projectId,
            filename: vd.filename,
            transcript: vd.transcript,
            source_url: vd.sourceUrl,
            position: vd.position,
            duration: Duration.toDB(vd.duration) ?? -1
        }))

    const { data, error } = await supabase
        .from('videos')
        .upsert(toUpsert)
        .select()
    
    return toUpsert
}

/** Generate a source URL for a video file in Google Cloud Storage. */
export async function getVideoUrl(
    filename: string,
    action: 'read' | 'write' = 'read',
    expiresInSeconds: number = 60 * 60 * 1, // 1 hour expiration
): Promise<string> {
    if (!process.env.BUCKET_NAME) {
        return ""
    }
    if (!process.env.GOOGLE_SERVICE_KEY) {
        return ""
    }
    const credential = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString())
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: credential.client_email,
          private_key: credential.private_key,
        },
    });
    // Get a v4 signed URL for reading the file
    const [url] = await storage.bucket(process.env.BUCKET_NAME)
        .file(filename)
        .getSignedUrl({
            version: 'v4',
            action: action,
            expires: Date.now() + expiresInSeconds * 1000, // expiresIn seconds
        });

    return url
}

export type WordInfo = {
    word: string
    start: number
    end: number
    index: number
    skip: boolean
}

export async function getVideoTranscript(filename: string, duration: number) {
    console.log("getting video transcript")

    // Creates a client
    const client = new SpeechClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */

    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize({
        config: {
            enableWordTimeOffsets: true,
            encoding: 'MP3',
            languageCode: 'en-US',
            sampleRateHertz: 44100,
            audioChannelCount: 1,
            model: 'latest_long',
            enableAutomaticPunctuation: true,
        },
        audio: {
            uri: `gs://${process.env.BUCKET_NAME}/${changeExtension(filename, "mp3")}`
        }
    });

    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const result: WordInfo[] = []
    let i = 0;
    response.results?.forEach((res) => {
        res?.alternatives?.[0].words?.forEach((wordInfo) => {
            const obj = {
                word: wordInfo.word!,
                start: Number(wordInfo.startTime!.seconds) + wordInfo.startTime!.nanos! / 1e9,
                end: Number(wordInfo.endTime!.seconds) + wordInfo.endTime!.nanos! / 1e9,
                skip: false,
                index: i++,
            }
            result.push(obj)
        })
    })
    return processVideoTranscript(result, duration)
}

type ExportVideoResponse = {
    url: string | null,
    error: string | null,
}

export async function exportFinalVideo(ffmpegTrimData: ExportData): Promise<ExportVideoResponse> {
    const resource = process.env.EXPORT_VIDEO_POST_URL
    if (!resource) {
        return {
            url: null,
            error: "Failed to find resource to export video."
        }
    }
    console.log(resource)
    try {
        const response = await fetch(resource, {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ffmpegTrimData), // Convert the JavaScript object to JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json(); // Parse the JSON response
        return {
            url: jsonResponse?.url ?? null,
            error: jsonResponse?.error ?? null,
        }
    } catch (error) {
        return {
            url: null,
            error: "Network failure occurred, please try again."
        }
    }
}

const AUDIO_EXTRACT_FACTOR = 1

export async function waitForAudioExtract(filepath: string, videoDuration: number): Promise<boolean> {
    if (!process.env.BUCKET_NAME) {
        return false
    }
    if (!process.env.GOOGLE_SERVICE_KEY) {
        return false
    }
    const credential = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString())
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: credential.client_email,
          private_key: credential.private_key,
        },
    });
    // TODO: Put this in .env file instead
    const audioPath = changeExtension(filepath, "mp3")
    const file = storage.bucket(process.env.BUCKET_NAME).file(audioPath)
    const POLL_INTERVAL_MS = 1000
    const waitFor = Math.round(videoDuration * AUDIO_EXTRACT_FACTOR)

    console.log("waiting for audio file", audioPath)
    return new Promise((resolve, reject) => {
        let pollCount = 0
        const interval = setInterval(async () => {
            if (pollCount < waitFor) {
                // Bruh why does this function return an array
                // What happened to just true or false
                const [fileExists] = await file.exists()
                if (fileExists) {
                    clearInterval(interval)
                    resolve(true)
                } else {
                    pollCount += 1
                }
            } else {
                clearInterval(interval)
                resolve(false)
            }
        }, POLL_INTERVAL_MS)
    })
}