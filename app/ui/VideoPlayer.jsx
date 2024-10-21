import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { skipTo } from "../lib/utils";
import { PlayIcon, PauseIcon, BackwardIcon } from "@heroicons/react/24/solid";
import { intervalsToSkip, closeTo, wordAtTick } from "../lib/utils";

export default function VideoPlayer({ videoData, playFrom, allowedEmptyGap, setPlayFrom, setEditorFocus, windowWidth }) {

  const refreshRateMs = 100

  const [sourceIdx, setSourceIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();
  const intervalRef = useRef();

  const skipIntervals = videoData.map(({ transcript }) => {
    return intervalsToSkip(transcript, allowedEmptyGap);
  });
  const sourceUrls = videoData.map(({ sourceUrl }) => sourceUrl);

  useEffect(() => {
    const video = videoRef.current

    // On new sourceIdx, seek to start or skip to next video as needed
    const skipTime = skipTo(0, skipIntervals?.[sourceIdx] ?? [])
    const endOfVideo = videoData?.[sourceIdx]?.duration
    if (closeTo(skipTime, endOfVideo, 0.1)) {
      nextVideoOrStop()
    } else if (skipTime) {
      video.seekTo(skipTime + 0.1, 'seconds')
    }

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (video) {
          const tick = video.getCurrentTime()
          const skipTime = skipTo(tick, skipIntervals?.[sourceIdx] ?? [])
          const endOfVideo = videoData?.[sourceIdx].duration
          const transcript = videoData?.[sourceIdx].transcript ?? []

          if (closeTo(skipTime, endOfVideo, 0.1)) {
            nextVideoOrStop();
          } else if (skipTime) {
            video.seekTo(skipTime + 0.1, 'seconds')
          }
          const wordIndex = wordAtTick(tick, transcript)
          if (wordIndex != null) {
            setEditorFocus(wordIndex);
          }
        }
      }, refreshRateMs)
    }
    return () => clearInterval(intervalRef.current)
  }, [sourceIdx, isPlaying])

  // Listen to `playFrom` and seek, then unset
  useEffect(() => {
    if (videoRef.current && playFrom) {
      setSourceIdx(playFrom.sourceIdx)
      setTimeout(() => videoRef.current.seekTo(playFrom.seconds, "seconds"), 10)
      setPlayFrom(null)
    }
  }, [playFrom])

  const icon = (
    isPlaying ? 
    <PauseIcon className="size-6 text-onprimary" /> : 
    <PlayIcon className="size-6 text-onprimary" />
  )

  const playerWidth = Math.min(720, windowWidth - 10)
  const playerHeight = playerWidth * 9 / 16
  return (
    <div className="mb-6">
      <ReactPlayer
        width={playerWidth}
        height={playerHeight}
        ref={videoRef}
        url={sourceUrls[sourceIdx]}
        playing={isPlaying}
        onEnded={() => {
          nextVideoOrStop();
        }}
      />
      <div className="flex justify-center gap-x-2 mt-1">
        <button
          className="rounded-md bg-primary p-2"
          onClick={handlePlayClick}
        >
          {icon}
        </button>
        <button 
          className="rounded-md bg-primary p-2"
          onClick={handleBackClick}
        >
          <BackwardIcon className="size-6 text-onprimary" />
        </button>
      </div>
    </div>
  );

  // Helper Functions ******************************************************

  /** On back click, go to first video and seek to start */
  function handleBackClick() {
    setSourceIdx(0)
    videoRef.current?.seekTo(0, 'seconds')
  }

  /** On play, seek to `playFrom` if available, then start playing! */
  function handlePlayClick() {
    setIsPlaying(!isPlaying)
  }

  function nextVideoOrStop() {
    if (sourceIdx + 1 < sourceUrls.length) {
      setSourceIdx(sourceIdx + 1)
    } else {
      setIsPlaying(false)
    }
  }
}
