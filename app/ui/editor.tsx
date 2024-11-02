import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { WordInfo } from "../lib/videos";
import { extractFilename, nestedListAt, range } from "@/app/lib/utils";
import {
  Change,
  PlayFrom,
  SavingState,
  VideoData,
  VideoDataStatus,
} from "../MainEditor";
import { arrayMove } from "@dnd-kit/sortable";
import EditorSaveIcon from "./editor-save-icon";
import Word from "./word";
import Gap from "./gap";

const allowedKeys = new Set([
  "Backspace",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "ArrowUp",
  " ",
]);

export type Selection = {
  start: number;
  end: number;
};

const UNDO_LOOKBACK = 50;

export default function TextEditor({
  videoData,
  changes,
  savingToCloud,
  editorFocus,
  setIsPlaying,
  setVideoData,
  setPlayFrom,
  setChanges,
  setEditorFocus,
}: {
  videoData: VideoData[];
  changes: Change[];
  savingToCloud: SavingState;
  editorFocus: number;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setVideoData: Dispatch<SetStateAction<VideoData[]>>;
  setPlayFrom: Dispatch<SetStateAction<PlayFrom | null>>;
  setChanges: Dispatch<SetStateAction<Change[]>>;
  setEditorFocus: Dispatch<SetStateAction<number>>;
}) {
  const editorRef: any = useRef();
  const [redoStack, setRedoStack] = useState<Change[]>([]);
  const [hideSkippedWords, setHideSkippedWords] = useState<boolean>(false);

  const transcripts = videoData
    .filter(
      (videoData): videoData is VideoData & { transcript: WordInfo[] } =>
        videoData.transcript != null
    )
    .map((videoData) => videoData.transcript);

  const existingVideoData = videoData.some(
    (vd) => vd.status == VideoDataStatus.COMPLETE
  );

  return (
    <div className="relative">
      <label className="absolute -top-7 left-2">
        <input
          type="checkbox"
          className="mr-1"
          onChange={() => {
            setHideSkippedWords((hideSkippedWords) => !hideSkippedWords);
          }}
          value={hideSkippedWords.toString()}
        />
        Hide deleted items
      </label>
      <div
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning={true}
        className="flex content-start flex-wrap w-full max-w-3xl border-2 border-primary rounded-lg p-4 text-xl h-[512px] overflow-y-scroll mb-12"
        ref={editorRef}
        onKeyDown={handleKeyDown}
        onClick={handleOnClick}
      >
        {existingVideoData ? (
          videoData.map((vd) => {
            return (
              <Fragment key={vd.id}>
                <p className="h-6 text-sm italic text-gray-500 w-full">
                  {extractFilename(vd.filename)}
                </p>
                {vd.transcript?.map((wordInfo, index) => {
                  if (hideSkippedWords && wordInfo.skip) {
                    return null;
                  } else if (wordInfo.word) {
                    return (
                      <Word
                        key={index}
                        wordInfo={wordInfo}
                        focus={wordInfo.index == editorFocus}
                      />
                    );
                  } else {
                    return (
                      <Gap
                        key={index}
                        wordInfo={wordInfo}
                        focus={wordInfo.index == editorFocus}
                      />
                    );
                  }
                })}
                <div className="w-full h-6"></div>
              </Fragment>
            );
          })
        ) : (
          <p className="text-md italic text-gray-500 w-full">
            Welcome! Upload your raw video to get started. Your transcribed
            content will appear here. Happy editing!
          </p>
        )}
      </div>
      <EditorSaveIcon savingToCloud={savingToCloud} />
    </div>
  );

  // Helper Functions ******************************************************

  /** Updates indices in `toUpdate` to `value` in the transcript. */
  function updateTranscripts(toUpdate: Set<number>, value: boolean = true) {
    setVideoData(
      videoData.map(({ transcript, ...videoData }) => {
        return {
          ...videoData,
          transcript:
            transcript?.map((ts) => {
              const shouldSkip = toUpdate.has(ts.index);
              return {
                ...ts,
                ...(shouldSkip && { skip: value }),
              };
            }) ?? null,
        };
      })
    );
  }

  /** Given window selection range, what editor indices are selected? */
  function getSelectedWords(): Selection {
    const windowSelection = window.getSelection();
    const dragStart = windowSelection?.anchorNode?.parentElement?.id
      ? Number(windowSelection?.anchorNode?.parentElement?.id)
      : -1;
    const dragEnd = windowSelection?.focusNode?.parentElement?.id
      ? Number(windowSelection?.focusNode?.parentElement?.id)
      : -1;
    const selection = {
      start: Math.min(dragStart, dragEnd),
      end: Math.max(dragStart, dragEnd),
    };
    return selection;
  }

  /** Determine which key was pressed. If key not allowed, no effect.
   *
   * If Backspace, store selection range to handle in onChange. */
  function handleKeyDown(e: any) {
    if (e.key === "z" && e.metaKey && e.shiftKey) {
      redo();
    } else if (e.key === "z" && e.metaKey) {
      undo();
    } else if (!allowedKeys.has(e.key)) {
      e.preventDefault();
    } else if (e.key === "Backspace" && e.metaKey) {
      e.preventDefault();
      handleBackspace({ value: false });
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace({ value: true });
    } else if (e.code === "Space") {
      e.preventDefault();
      setIsPlaying((isPlaying) => !isPlaying);
    }
  }

  /** Which word in editor was clicked? Then calculate `playFrom` for video player. */
  function handleOnClick(e: any) {
    const selection = getSelectedWords();
    if (selection.start != selection.end) {
      return;
    }
    const editorIndex = selection.start;
    setEditorFocus(editorIndex);
    if (!Number.isNaN(editorIndex)) {
      const [sourceIdx, word] = nestedListAt(editorIndex, transcripts);
      setPlayFrom({ sourceIdx, seconds: word.start });
    }
  }

  function handleBackspace({ value = true }: { value?: boolean }) {
    const selection = getSelectedWords();

    const editorIndexToDelete = new Set<number>(
      range(selection.start, selection.end)
    );
    updateTranscripts(editorIndexToDelete, value);
    setChanges((changes) => {
      const updated: Change[] = [
        ...changes,
        { type: "editor_change", skippedIndices: editorIndexToDelete },
      ];
      if (updated.length > UNDO_LOOKBACK) {
        updated.shift();
      }
      return updated;
    });

    // Add new selection range at last sibling
    setSelectionRangeToPrevNode();
  }

  /** Editor is list of `span` nodes with text. */
  function setSelectionRangeToPrevNode() {
    const windowSelection = window.getSelection();
    const textNode = windowSelection?.getRangeAt(0).startContainer;

    // Transcript words are text within a span tag
    let node = textNode?.parentElement?.previousElementSibling;
    let wordText = node?.tagName === "SPAN" ? node?.childNodes[0] : null;
    while (!wordText && node) {
      wordText = node?.tagName === "SPAN" ? node?.childNodes[0] : null;
      node = node?.previousElementSibling;
    }
    if (wordText) {
      const newRange = document.createRange();
      newRange.setStart(wordText, wordText.textContent?.length ?? 0);
      newRange.collapse(true);

      windowSelection?.removeAllRanges();
      windowSelection?.addRange(newRange);
    }
  }

  function unapplyChange(change: Change) {
    if (change.type === "editor_change") {
      updateTranscripts(change.skippedIndices, false);
    } else if (change.type === "videos_change") {
      setVideoData(arrayMove(videoData, change.newIndex, change.oldIndex));
    }
  }

  function applyChange(change: Change) {
    if (change.type === "editor_change") {
      updateTranscripts(change.skippedIndices, true);
    } else if (change.type === "videos_change") {
      setVideoData(arrayMove(videoData, change.oldIndex, change.newIndex));
    }
  }

  /** Unapply lastApplied change. -1 means use latest change. null means unapplied all changes. */
  function undo() {
    const unapply = changes.length - 1;
    const change = changes[unapply];
    if (change) {
      unapplyChange(change);
      setChanges(changes.slice(0, -1));
      setRedoStack([...redoStack, change]);
    }
  }

  function redo() {
    const apply = redoStack.length - 1;
    const change = redoStack[apply];
    if (change) {
      applyChange(change);
      setRedoStack(redoStack.slice(0, -1));
      setChanges((changes) => [...changes, change]);
    }
  }
}
