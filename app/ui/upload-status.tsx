"use client";

import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import { VideoDataStatus } from "../MainEditor";
import ProgressBar from "./progress-bar";

const UPLOAD_FACTOR = 0.2;
const AUDIO_EXTRACT_FACTOR = 0.1;
const TRANSCRIBE_FACTOR = 1 / 2;

export default function UploadStatus({
  status,
  duration,
  text,
}: {
  status: VideoDataStatus;
  duration: number;
  text: string;
}) {
  if (status == VideoDataStatus.UPLOADING) {
    return (
      <div>
        <div className="flex gap-x-1 items-center">
          <p className="line-clamp-2">Uploading...</p>
          <CloudArrowUpIcon className="size-4 animate-pulse" />
        </div>
        <ProgressBar duration={duration * UPLOAD_FACTOR} height={2} />
      </div>
    );
  } else if (status == VideoDataStatus.EXTRACTING) {
    return (
      <div>
        <div className="flex gap-x-1 items-center">
          <p className="line-clamp-2">Extracting Audio...</p>
          <CogIcon className="size-4 animate-spin" />
        </div>
        <ProgressBar duration={duration * AUDIO_EXTRACT_FACTOR} height={2} />
      </div>
    );
  } else if (status == VideoDataStatus.TRANSCRIBING) {
    return (
      <div>
        <div className="flex gap-x-1 items-center">
          <p className="line-clamp-2">Transcribing...</p>
          <ArrowPathIcon className="size-4 animate-spin" />
        </div>
        <ProgressBar duration={duration * TRANSCRIBE_FACTOR} height={2} />
      </div>
    );
  } else if (status == VideoDataStatus.COMPLETE && !text) {
    return <p>{"<Empty Transcript>"}</p>;
  } else {
    return <p className="line-clamp-2">{text}</p>;
  }
}
