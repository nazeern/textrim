"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoPlayer from "@/app/ui/VideoPlayer";
import { WordInfo, exportFinalVideo, upsertVideoData } from "./lib/videos";
import TextEditor from "@/app/ui/editor";
import SideRail from "./ui/side-rail";
import { debounce } from "lodash";
import { PopupWrapper } from "./ui/popup-wrapper";
import { ExportModal } from "./ui/export-modal";
import {
  delay,
  getFfmpegTrimData,
  intervalsToKeep,
  intervalsToSkip,
  processVideoTranscript,
} from "./lib/utils";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

const WAIT_FOR_INACTIVITY_SECONDS = 5;

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
  userId,
}: {
  loadedVideoData: VideoData[];
  userId: string;
}) {
  const isMounted = useRef<boolean>(false);
  const [savingToCloud, setSavingToCloud] = useState<SavingState>(
    SavingState.SAVED
  );
  const [videoData, setVideoData] = useState<VideoData[]>(loadedVideoData);
  const [playFrom, setPlayFrom] = useState<PlayFrom | null>(null);
  const [changes, setChanges] = useState<Change[]>([]);
  const [allowedEmptyGap, setAllowedEmptyGap] = useState<number>(Infinity);
  const [editorFocus, setEditorFocus] = useState<number>(-1);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [finalUrl, setFinalUrl] = useState<string>("");
  const [exportProgress, setExportProgress] = useState<number>(0);

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

  return (
    <div>
      <SideRail
        videoData={videoData}
        allowedEmptyGap={allowedEmptyGap}
        setVideoData={setVideoData}
        setChanges={setChanges}
        setAllowedEmptyGap={setAllowedEmptyGap}
      />
      <div className="flex flex-col gap-y-1 items-center">
        <button
          className="flex items-center gap-x-1 self-end bg-primary hover:bg-primaryhov p-2 text-onprimary rounded-lg"
          onClick={handleExport}
        >
          Export <ArrowUpTrayIcon className="size-5" />
        </button>
        <VideoPlayer
          videoData={videoData}
          playFrom={playFrom}
          allowedEmptyGap={allowedEmptyGap}
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
        />
      </div>
      {showExportModal && (
        <PopupWrapper setVisible={setShowExportModal}>
          <ExportModal finalUrl={finalUrl} exportProgress={exportProgress} />
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
    const upserted = await upsertVideoData(userId, videoData);
    setSavingToCloud(SavingState.SAVED);
    // console.log(upserted);
  }

  async function handleExport() {
    setShowExportModal(true);
    if (!finalUrl) {
      const ffmpegTrimData = getFfmpegTrimData(
        videoData,
        userId,
        allowedEmptyGap
      );
      const expectedExportDuration = (ffmpegTrimData.outputDuration * 3) / 4;

      const progressPerSecond = Math.round((1 / expectedExportDuration) * 100);
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
}
