import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WordInfo } from "./videos";
import { Selection } from "@/app/ui/editor"
import { VideoData } from "../MainEditor";
import { last } from "lodash";


export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Given a selection range and input string, return the indices of the selected words. */
export function cursorToIndex(selection: Selection, str: string, spaceFavorsLeft: boolean = true): number[] {
  let startIndex, endIndex, char;
  let countSpaces = 0;
  // spaceFavorsLeft leaves out the last char in the selection range
  for (let i = 0; i < (selection.end - +spaceFavorsLeft); i++) {
    char = str[i]
    if (char === ' ') {
      countSpaces++
    }
    if (i == selection.start) {
      startIndex = countSpaces;
    }
  }
  endIndex = countSpaces
  if (startIndex == undefined) {
    return [endIndex]
  } else {
    return range(startIndex, endIndex)
  }
}

export function nestedListAt(index: number, lists: any[][]): [number, any] {
  let curr = 0;
  while (curr < lists.length && index >= lists[curr].length) {
    index -= lists[curr].length
    curr++
  }
  return [curr, lists[curr][index]]
}

export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function range(start: number = 0, end: number): number[] {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return []
  }
  const vals = []
  for (let i = start; i <= end; i++) {
    vals.push(i)
  }
  return vals
}

export function validateVideo(file: File, projectId: string, videoData: VideoData[]): string | null {
  if (file.size >= 3 * 1024 * 1024 * 1024) {
      return "File size must be below 3GB."
  } else if (videoData.map(({ filename }) => filename).includes(projectId + "_" + file.name)) {
      return "File already exists."
  } else {
    return null
  }
}

/** Compute video duration by loading metadata into DOM. */
export async function calculateVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';

    const videoURL = URL.createObjectURL(file);
    videoElement.src = videoURL;

    // When video metadata is loaded, resolve the promise with duration
    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoURL); // Clean up the URL
      const duration = videoElement.duration; // Get video duration in seconds
      resolve(duration);
    };

    // If there's an error loading the video, reject the promise
    videoElement.onerror = () => {
      URL.revokeObjectURL(videoURL); // Clean up the URL
      reject(new Error('Error loading video metadata.'));
    };
  });
}

type PhraseInterval = {
  phrase: string
  start: number
  end: number
}

type Interval = {
  start: number,
  end: number,
}

type FormattedInterval = {
  start: string,
  end: string,
}

const INTERVAL_BUFFER = 0
export function skipTo(tick: number, intervals: PhraseInterval[]): number | null {
  let hi = intervals.length - 1;
  let lo = 0;
  let mid;
  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2);
    if ((intervals[mid].start + INTERVAL_BUFFER) <= tick && intervals[mid].end >= tick) {
      return intervals[mid].end;
    } else if (intervals[mid].start < tick) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return null;
}

export function wordAtTick(tick: number, transcript: WordInfo[]): number | null {
  let hi = transcript.length - 1;
  let lo = 0;
  let mid;
  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2);
    if ((transcript[mid].start) <= tick && tick <= transcript[mid].end) {
      return transcript[mid].index;
    } else if (transcript[mid].start < tick) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return null;
}

/** What intervals do we want from the transcript? Also, what captions are needed? */
export function intervalsToKeep(transcript: WordInfo[] | null, allowedEmptyGap: number, returnCaptions: boolean = false, maxCaptionLength: number = 30): [Interval[], number, Caption[]] {
  if (!transcript) {
    return [[], 0, []]
  }
  const keepIntervals = []
  
  const wordsToKeep = transcript.filter((wordInfo) => (wordInfo.word || wordInfo.end - wordInfo.start <= allowedEmptyGap) && !wordInfo.skip)
  let interval: Interval | null = null
  for (const wordInfo of wordsToKeep) {
    if (!interval) {
      interval = { start: wordInfo.start, end: wordInfo.end }
    } else if (wordInfo.start - interval.end <= 0) {
      interval.end = wordInfo.end
    } else {
      keepIntervals.push(interval)
      interval = { start: wordInfo.start, end: wordInfo.end }
    }
  }
  if (interval) {
    keepIntervals.push(interval)
  }
  const outputDuration = keepIntervals.reduce((currValue, nextInterval) => currValue + nextInterval.end - nextInterval.start, 0)

  if (!returnCaptions) {
    return [keepIntervals, outputDuration, []]
  }

  // Combine words into caption, separating if they don't flow together, or too many characters.
  const captions: Caption[] = []

  // Track how much time elapsed, and how long the word is. This decides the captions.
  let elapsed: number = 0.0
  let caption: Caption | null = null
  for (let i = 0; i < wordsToKeep.length; i++) {
    const wordInfo = wordsToKeep[i]
    const lastWordInfo = wordsToKeep[i-1]
    if (wordInfo.word !== "") {
      const wordDuration = wordInfo.end - Math.max(wordInfo.start, lastWordInfo?.end ?? 0)
      if (!caption) {
        caption = { phrase: wordInfo.word, start: elapsed, end: elapsed + wordDuration }
      } else if (wordInfo.start - lastWordInfo.end <= 0 && wordInfo.word.length + caption.phrase.length <= maxCaptionLength) {
        caption.end = elapsed + wordDuration
        caption.phrase += (" " + wordInfo.word)
      } else {
        captions.push(caption)
        caption = { phrase: wordInfo.word, start: elapsed, end: elapsed + wordDuration }
      }
    }
    elapsed += wordInfo.end - Math.max(lastWordInfo?.end ?? 0, wordInfo.start)
  }
  if (caption) {
    captions.push(caption)
  }

  return [keepIntervals, outputDuration, captions]
}

/** What intervals should the VideoPlayer skip over? */
export function intervalsToSkip(transcript: WordInfo[] | null, allowedEmptyGap: number): Interval[] {
  if (transcript == null) {
    return []
  }
  const skipIntervals = []
  
  const wordsToSkip = transcript.filter((wordInfo) => (!wordInfo.word && wordInfo.end - wordInfo.start > allowedEmptyGap) || wordInfo.skip)
  let interval: Interval | null = null
  for (const wordInfo of wordsToSkip) {
    if (!interval) {
      interval = { start: wordInfo.start, end: wordInfo.end }
    } else if (wordInfo.start - interval.end <= 0) {
      interval.end = wordInfo.end
    } else {
      skipIntervals.push(interval)
      interval = { start: wordInfo.start, end: wordInfo.end }
    }
  }
  if (interval) {
    skipIntervals.push(interval)
  }
  
  return skipIntervals
}


type TrimData = {
  filename: string,
  intervals: FormattedInterval[]
}

export type ExportData = {
  projectId: string,
  outputDuration: number,
  data: TrimData[]
}

/** `joinIntervals` returns a readable format encoding intervals and phrases.
 * This function combines intervals where possible to decide which clips to take.
 */
export function getFfmpegTrimData(videoData: VideoData[], projectId: string, allowedEmptyGap: number): ExportData {

  let outputDuration = 0.0
  const trimData = videoData.map(({ filename, transcript }) => {
    const [clips, videoDuration] = intervalsToKeep(transcript, allowedEmptyGap) ?? []
    outputDuration += videoDuration

    return {
      filename: filename,
      intervals: clips.map((clip) => ({
        start: `${Math.round(clip.start * 1000)}ms`,
        end:`${Math.round(clip.end * 1000)}ms`
      })),
    }
  })


  return {
    projectId: projectId,
    outputDuration: outputDuration,
    data: trimData,
  }
}

function srtFormat(seconds: number) {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0')
  const millis = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0')

  return `${hours}:${minutes}:${sec},${millis}`
}

export function generateCaptionsFile(videoData: VideoData[], allowedEmptyGap: number) {
  
  let baseDuration = 0;
  const captions: Caption[] = []
  for (const vd of videoData) {
    const [_, videoDuration, videoCaptions] = intervalsToKeep(vd.transcript, allowedEmptyGap, true)
    for (const cap of videoCaptions) {
      captions.push({
        phrase: cap.phrase,
        start: baseDuration + cap.start,
        end: baseDuration + cap.end,
      })
    }
    baseDuration = baseDuration + videoDuration
  }

  const srtString = captions.map(({ phrase, start, end }, index) => `${index + 1}\n${srtFormat(start)} --> ${srtFormat(end)}\n${phrase}\n`).join("\n")
  console.log(srtString)

  const blob = new Blob([srtString], { type: 'text/plain' })
  const srtUrl = URL.createObjectURL(blob)

  return srtUrl
}

export function changeExtension(filename: string, to: string): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) {
    // If there is no extension, just append .mp3
    return filename + "." + to;
  } else {
    // Replace the current extension with .mp3
    return filename.substring(0, dotIndex) + "." + to;
  }
}

const START_BUF = 0.2
const END_BUF = 0.5


/** The google transcript returns words, we add in the empty spaces. */
export function processVideoTranscript(transcript: WordInfo[], duration: number): WordInfo[] {
  const result = []

  let lastWordEnd = 0.0
  let i = 0
  for (const wordInfo of transcript) {
    const start = Math.max(0, round(wordInfo.start + START_BUF))
    const end = Math.min(duration, round(wordInfo.end + END_BUF))
    
    if (start - lastWordEnd > 0) {
      result.push({
        word: '',
        start: lastWordEnd,
        end: start,
        index: i++,
        skip: false,
      })
    }
    result.push({
      ...wordInfo,
      start: start,
      end: end,
      index: i++,
    })
    lastWordEnd = end
  }
  if (duration - lastWordEnd) {
    result.push({
      word: '',
      start: lastWordEnd,
      end: duration,
      index: i++,
      skip: false,
    })
  }

  return result
}

export function closeTo(a: number, b: number, dist: number) {
  return Math.abs(b - a) < dist
}

export function timeString(totalSeconds: number): string {
  if (totalSeconds == 0) {
    return "0s"
  }
  const rounded = round(totalSeconds, 1)
  const minutes = Math.floor(rounded / 60)
  const seconds = totalSeconds <= 0.94 ? round(rounded % 60, 1) : round(rounded % 60, 0)

  const output = []
  if (minutes) {
    output.push(minutes.toString() + "m")
  }
  if (seconds) {
    output.push(seconds.toString() + "s")
  }
  return output.join(' ')
}

export function timestampString(dateString: string) {
  const date = new Date(dateString)
  return date.toDateString()
}

const PER_MINUTE_RATE = 0.08
export function calculateCost(totalMinutesTranscribed: number) {
  return round(PER_MINUTE_RATE * totalMinutesTranscribed)
}

export function round(value: number, n: number = 2) {
  return parseFloat(value.toFixed(n))
}

export function currencyString(value: number) {
  return "$" + round(value / 100).toString()
}

export function extractFilename(filename: string): string {
  return filename.slice(filename.indexOf("_") + 1)
}

type Caption = {
  phrase: string;
  start: number;
  end: number;
};