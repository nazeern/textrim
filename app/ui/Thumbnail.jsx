"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import UploadStatus from "./upload-status";

export const Thumbnail = ({ id, position, text, status, duration, setVideoData }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group p-2 bg-primarybg text-primary border border-primary rounded-lg"
    >
      <UploadStatus text={text} status={status} duration={duration} />
      <button
        onMouseDown={restoreClick}
        className="absolute top-1 right-1 p-1 bg-primarybg border border-primary rounded-md opacity-0 group-hover:opacity-100 hover:bg-blue-100 transition-opacity"
      >
        <ArrowUturnLeftIcon className="size-5" />
      </button>
    </div>
  )

  function restoreClick() {
    setVideoData(videoData => videoData.map((vd, tsIndex) => ({
      ...vd,
      transcript: vd.transcript.map((wordInfo) => ({
        ...wordInfo,
        skip: (tsIndex == position) ? false : wordInfo.skip
      }))
    })))
  }


};