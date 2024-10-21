"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Thumbnail } from "./Thumbnail";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getVideoUrl, getVideoTranscript, waitForAudioExtract } from "../lib/videos";
import { calculateVideoDuration, delay, validateVideo } from "../lib/utils";
import { sampleTranscriptionResponse } from "../lib/data";
import { VideoDataStatus } from "../MainEditor";
import { UPLOAD_FACTOR } from "./upload-status";


const ALLOWED_GAP_DEFAULT = 0.5;  // seconds

export default function SideRail(
  { videoData, allowedEmptyGap, setVideoData, setChanges, setAllowedEmptyGap, setToastData }
) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { 
        delay: 100,
        tolerance: 5
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const removingEmptyIntervals = (allowedEmptyGap == Infinity) ? false : true;

  return (
    <div className="h-full flex flex-col gap-y-1 mx-6">
      <label>
        <input 
          type="checkbox"
          className="mr-1"
          onChange={(e) => { setAllowedEmptyGap(removingEmptyIntervals ? Infinity : ALLOWED_GAP_DEFAULT) }}
          value={removingEmptyIntervals}
        />
        Remove empty intervals
      </label>
      {removingEmptyIntervals && (
        <label>
          longer than 
          <input 
            className="mx-1 w-16 px-1 border border-primary rounded-md"
            type="number"
            value={allowedEmptyGap}
            onChange={handleallowedEmptyGapInput}
          />
           second(s)
        </label>
      )}
      <div className="flex flex-col gap-y-2 w-64 border border-primary p-1 h-1/2 rounded-md">
        <label 
          htmlFor="videoFile"
          className="flex justify-center items-center text-onprimary bg-primary py-2 rounded-lg hover:cursor-pointer hover:bg-primaryhov"
        >
          <PlusIcon className="size-6" />
          <p>Upload New Video</p>
        </label>
        <input
          className="invisible size-0 file:bg-primary file:text-onprimary file:border-0 file:p-2 file:rounded-lg file:hover:cursor-pointer"
          type="file"
          name="videoFile"
          multiple="multiple"
          onChange={handleMultipleFileUpload}
          accept="video"
          id="videoFile"
        />
        <p className="font-semibold text-lg">Transcriptions</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={videoData} strategy={verticalListSortingStrategy}>
            {videoData.map((obj) => (
              <Thumbnail
                id={obj.id}
                key={obj.id}
                position={obj.position}
                status={obj.status}
                text={obj.transcript?.map((word) => word.word).join(" ")}
                duration={obj.duration}
                setVideoData={setVideoData}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  
  );

  // Helper Functions ******************************************************

  async function handleMultipleFileUpload(event) {

    const files = Array.from(event.target.files)
    
    const promises = files.map((file) => handleSingleFileUpload(file))
    await Promise.all(promises)

    setToastData(null)
  }

  /** Validate and upload a single file. */
  async function handleSingleFileUpload(file) {
    const error = validateVideo(file, videoData);
    if (error) {
      return alert(error);
    }
    const videoDuration = await calculateVideoDuration(file);
    setToastData((td) => {
      const estimatedDuration = UPLOAD_FACTOR * videoDuration;
      return {
        totalUploadDuration: videoDuration + (td?.totalUploadDuration ?? 0),
        estimatedDuration: Math.max(estimatedDuration, (td?.estimatedDuration ?? 0)),
      }
    })


    console.log("Uploading video...")
    setVideoData(videoData => [
      ...videoData,
      {
        id: file.name,
        filename: file.name,
        sourceUrl: null,
        transcript: null,
        position: videoData.length,
        duration: videoDuration,
        status: VideoDataStatus.UPLOADING,
      }
    ])
    const signedUploadURL = await getVideoUrl(file.name, "write", 3);
    const response = await fetch(signedUploadURL, {
      method: "PUT",
      body: file,
    });
    if (!response.ok) {
      alert("Video upload failed. Please try again.")
    }
    const sourceUrl = await getVideoUrl(file.name, "read")



    console.log("Extracting audio...")
    setVideoData(videoData => videoData.map(
      vd => vd.id === file.name ? {
        ...vd,
        sourceUrl: sourceUrl, 
        duration: videoDuration, 
        status: VideoDataStatus.EXTRACTING
      } : vd
    ))
    const foundAudio = await waitForAudioExtract(file.name, videoDuration)
    if (!foundAudio) {
      console.log("Could not extract audio. Please try again.")
      alert("Could not extract audio. Please try again.")
      return
    }



    console.log("Transcribing...")
    setVideoData(videoData => videoData.map(
      vd => vd.id === file.name ? {...vd, status: VideoDataStatus.TRANSCRIBING} : vd
    ))
    // await delay(5 * 1000)
    const newTranscript = await getVideoTranscript(file.name, videoDuration)
    // const newTranscript = sampleTranscriptionResponse;
    // const newTranscript = [];
    setVideoData(videoData => videoData.map(
      (vd) => vd.id === file.name ? {
        ...vd,
        transcript: newTranscript,
        status: VideoDataStatus.COMPLETE,
      } : vd
    ))
  }


  /** Helper for draggable videos. */
  function handleDragEnd(event) {
    const { active, over } = event;
    if (event && (active.id !== over.id)) {
      let oldIndex, newIndex;
      setVideoData((items) => {
        const ids = items.map((obj) => obj.id)
        oldIndex = ids.indexOf(active.id);
        newIndex = ids.indexOf(over.id);

        let i = 0;
        return arrayMove(items, oldIndex, newIndex)
      });
      setChanges(changes => [...changes, { type:"videos_change", oldIndex, newIndex }])
    }
  }

  function handleallowedEmptyGapInput(event) {
    setAllowedEmptyGap(event.target.value)
  }
}
