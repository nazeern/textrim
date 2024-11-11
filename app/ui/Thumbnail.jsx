"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUturnLeftIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import UploadStatus from "./upload-status";
import { deleteVideo } from "../lib/videos";
import { useState } from "react";

export const Thumbnail = ({ id, position, text, status, duration, projectId, setVideoData }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [needsConfirm, setNeedsConfirm] = useState(false)

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
        onMouseDown={async () => await deleteClick()}
        className="absolute top-1 right-1 p-1 bg-primarybg border border-primary rounded-md opacity-0 group-hover:opacity-100 hover:bg-blue-100 transition-opacity"
      >
        {needsConfirm ? <CheckIcon className="size-5" /> : <TrashIcon className="size-5" />}
      </button>
    </div>
  )

  async function deleteClick() {
    if (!needsConfirm) {
      setNeedsConfirm(true)
      return
    }
    setVideoData(videoData => videoData.filter((vd) => id !== vd.id))
    const errorMsg = await deleteVideo(id, projectId)
    if (errorMsg) {
      alert(errorMsg)
      return
    }
  }


};