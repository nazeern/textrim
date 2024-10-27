"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoPlayer from "@/app/ui/VideoPlayer";
import {
  WordInfo,
  exportFinalVideo,
  getVideoTranscript,
  getVideoUrl,
  upsertVideoData,
  waitForAudioExtract,
} from "./lib/videos";
import TextEditor from "@/app/ui/editor";
import SideRail from "./ui/side-rail";
import { debounce } from "lodash";
import { PopupWrapper } from "./ui/popup-wrapper";
import { ExportModal } from "./ui/export-modal";
import {
  calculateVideoDuration,
  getFfmpegTrimData,
  timeString,
  validateVideo,
} from "./lib/utils";
import {
  PlusIcon,
  ArrowUpTrayIcon,
  XCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Toast from "./ui/toast";
import { UPLOAD_FACTOR } from "./ui/upload-status";
import { stripeMeterEvent } from "./lib/stripe";
import { Plan } from "./(main)/pricing/page";

const WAIT_FOR_INACTIVITY_SECONDS = 5;
const EXPORT_FACTOR = 0.6;

export type Change = EditorChange | VideosChange;

export type VideosChange = {
  type: "videos_change";
  oldIndex: number;
  newIndex: number;
};

export type EditorChange = {
  type: "editor_change";
  skippedIndices: Set<number>;
};

export type PlayFrom = {
  sourceIdx: number;
  seconds: number;
};

export type VideoData = {
  filename: string;
  sourceUrl: string | null;
  transcript: WordInfo[] | null;
  id: string;
  position: number;
  duration: number | null;
  status: VideoDataStatus;
};

export type ToastData = {
  estimatedDuration: number;
  totalUploadDuration: number;
};

export enum VideoDataStatus {
  UPLOADING,
  EXTRACTING,
  TRANSCRIBING,
  COMPLETE,
}

export enum SavingState {
  CHANGED,
  SAVING,
  SAVED,
}

export default function MainEditor({
  loadedVideoData,
  projectId,
  userId,
  plan,
}: {
  loadedVideoData: VideoData[];
  projectId: string;
  userId: string;
  plan: Plan;
}) {
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [toastData, setToastData] = useState<ToastData | null>();

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const isMounted = useRef<boolean>(false);
  const [savingToCloud, setSavingToCloud] = useState<SavingState>(
    SavingState.SAVED
  );
  const [videoData, setVideoData] = useState<VideoData[]>(loadedVideoData);
  const [playFrom, setPlayFrom] = useState<PlayFrom | null>(null);
  const [changes, setChanges] = useState<Change[]>([]);
  const [allowedEmptyGap, setAllowedEmptyGap] = useState<number>(Infinity);
  const [editorFocus, setEditorFocus] = useState<number>(-1);
  const [finalUrl, setFinalUrl] = useState<string>("");
  const [exportProgress, setExportProgress] = useState<number>(0);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  const debouncedUpsertToDB = useCallback(
    debounce(
      (videoData) => saveVideoDataToDB(videoData),
      WAIT_FOR_INACTIVITY_SECONDS * 1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  // rebuild index on update when needed
  useEffect(() => {
    if (isMounted.current == false) {
      isMounted.current = true;
    } else {
      setSavingToCloud(SavingState.CHANGED);

      debouncedUpsertToDB(videoData);

      rebuildTranscriptIndexIfNeeded();
    }
  }, [videoData]);

  const showSideRail = windowWidth >= 1024;
  const toastString = toastData
    ? `Processing ${timeString(
        toastData.totalUploadDuration
      )} of video in estimated ${timeString(toastData.estimatedDuration)}...`
    : null;

  return (
    <div className="w-full flex">
      <div className="flex flex-1 justify-center items-center">
        {showSideRail && (
          <SideRail
            videoData={videoData}
            allowedEmptyGap={allowedEmptyGap}
            projectId={projectId}
            userId={userId}
            setVideoData={setVideoData}
            setChanges={setChanges}
            setAllowedEmptyGap={setAllowedEmptyGap}
            setToastData={setToastData}
          />
        )}
      </div>
      <div className="flex shrink flex-none flex-col gap-y-1 items-center">
        {toastData && (
          <Toast style="base">
            <div className="flex justify-between gap-x-2">
              <div className="italic flex flex-wrap w-full">
                {toastString}
                <Cog6ToothIcon className="size-5 animate-spin" />
                {toastData.estimatedDuration > 300 && (
                  <p className="ml-auto">Grab some coffee? ☕</p>
                )}
              </div>
              <button onClick={() => setToastData(null)}>
                <XCircleIcon className="size-5" />
              </button>
            </div>
          </Toast>
        )}
        <div className="flex w-full">
          {!showSideRail ? (
            <div>
              <label
                htmlFor="videoFile"
                className="flex items-center gap-x-1 text-onprimary bg-primary rounded-lg p-2"
              >
                <p>Upload</p>
                <PlusIcon className="size-6" />
              </label>
              <input
                className="hidden"
                type="file"
                name="videoFile"
                multiple
                onChange={handleMultipleFileUpload}
                accept="video"
                id="videoFile"
              />
            </div>
          ) : (
            <div />
          )}
          <button
            className="ml-auto flex items-center gap-x-1 bg-primary hover:bg-primaryhov p-2 text-onprimary rounded-lg"
            onClick={handleExport}
          >
            Export <ArrowUpTrayIcon className="size-5" />
          </button>
        </div>
        <VideoPlayer
          videoData={videoData}
          playFrom={playFrom}
          allowedEmptyGap={allowedEmptyGap}
          windowWidth={windowWidth}
          setPlayFrom={setPlayFrom}
          setEditorFocus={setEditorFocus}
        />
        <TextEditor
          videoData={videoData}
          changes={changes}
          savingToCloud={savingToCloud}
          editorFocus={editorFocus}
          setVideoData={setVideoData}
          setPlayFrom={setPlayFrom}
          setChanges={setChanges}
          setEditorFocus={setEditorFocus}
        />
      </div>
      <div className="flex-1"></div>
      {showExportModal && (
        <PopupWrapper setVisible={setShowExportModal}>
          <ExportModal
            finalUrl={finalUrl}
            exportProgress={Math.round(exportProgress)}
          />
        </PopupWrapper>
      )}
    </div>
  );

  function rebuildTranscriptIndexIfNeeded() {
    const stillLoading = videoData.some((vd) => vd.transcript == null);
    if (stillLoading) {
      return;
    }
    const notIndexed = videoData
      .map((vd) => vd.transcript)
      .flat()
      .map((ts) => ts!.index)
      .some((tsIndex, index) => tsIndex != index);
    if (notIndexed) {
      console.log("not indexed, rebuilding");
      let i = 0;
      const indexed = videoData.map((vd, index) => ({
        ...vd,
        position: index,
        transcript:
          vd.transcript?.map((word) => ({
            ...word,
            index: i++,
          })) ?? null,
      }));
      setVideoData((videoData) => indexed);
    }
  }

  async function saveVideoDataToDB(videoData: VideoData[]) {
    console.log("saving to DB");
    console.log(videoData);

    setSavingToCloud(SavingState.SAVING);
    const upserted = await upsertVideoData(projectId, videoData);
    setSavingToCloud(SavingState.SAVED);
    // console.log(upserted);
  }

  async function handleExport() {
    setShowExportModal(true);
    if (!finalUrl) {
      const ffmpegTrimData = getFfmpegTrimData(
        videoData,
        projectId,
        allowedEmptyGap
      );
      const expectedExportDuration =
        ffmpegTrimData.outputDuration * EXPORT_FACTOR;

      const progressPerSecond = (1 / expectedExportDuration) * 100;
      const progressUpdateInterval = setInterval(() => {
        setExportProgress((progress) => {
          if (progress + progressPerSecond > 99) {
            clearInterval(progressUpdateInterval);
            return 99;
          } else {
            return progress + progressPerSecond;
          }
        });
      }, 1000);

      exportFinalVideo(ffmpegTrimData).then((res) => {
        clearInterval(progressUpdateInterval);
        setExportProgress(100);
        setFinalUrl(res?.url ?? "");
      });
    }
  }

  async function handleMultipleFileUpload(event: any) {
    const files = Array.from(event.target.files);

    const promises = files.map((file) => handleSingleFileUpload(file as File));
    await Promise.all(promises);

    setToastData(null);
  }

  /** Validate and upload a single file. */
  async function handleSingleFileUpload(file: File) {
    const error = validateVideo(file, projectId, videoData);
    if (error) {
      return alert(error);
    }
    const videoDuration = await calculateVideoDuration(file);
    if (videoDuration == null) {
      alert("Error uploading video. Please reload and try again!");
      return;
    }
    setToastData((td) => {
      const estimatedDuration = UPLOAD_FACTOR * videoDuration;
      return {
        totalUploadDuration: videoDuration + (td?.totalUploadDuration ?? 0),
        estimatedDuration: Math.max(
          estimatedDuration,
          td?.estimatedDuration ?? 0
        ),
      };
    });

    const filename = `${projectId}_${file.name}`;
    console.log("Uploading video...");
    setVideoData((videoData) => [
      ...videoData,
      {
        id: filename,
        filename: filename,
        sourceUrl: null,
        transcript: null,
        position: videoData.length,
        duration: videoDuration,
        status: VideoDataStatus.UPLOADING,
      },
    ]);
    const signedUploadURL = await getVideoUrl(filename, "write", 3);
    const response = await fetch(signedUploadURL, {
      method: "PUT",
      body: file,
    });
    if (!response.ok) {
      alert("Video upload failed. Please try again.");
    }
    const sourceUrl = await getVideoUrl(filename, "read");

    console.log("Extracting audio...");
    setVideoData((videoData) =>
      videoData.map((vd) =>
        vd.id === filename
          ? {
              ...vd,
              sourceUrl: sourceUrl,
              duration: videoDuration,
              status: VideoDataStatus.EXTRACTING,
            }
          : vd
      )
    );
    const foundAudio = await waitForAudioExtract(filename, videoDuration);
    if (!foundAudio) {
      console.log("Could not extract audio. Please try again.");
      alert("Could not extract audio. Please try again.");
      return;
    }

    console.log("Transcribing...");
    setVideoData((videoData) =>
      videoData.map((vd) =>
        vd.id === filename
          ? { ...vd, status: VideoDataStatus.TRANSCRIBING }
          : vd
      )
    );
    // await delay(5 * 1000)
    const newTranscript = await getVideoTranscript(filename, videoDuration);
    // const newTranscript = sampleTranscriptionResponse;
    // const newTranscript = [];
    await stripeMeterEvent(userId, videoDuration);
    setVideoData((videoData) =>
      videoData.map((vd) =>
        vd.id === filename
          ? {
              ...vd,
              transcript: newTranscript,
              status: VideoDataStatus.COMPLETE,
            }
          : vd
      )
    );
  }
}
