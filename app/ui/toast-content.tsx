"use client";

import { Cog6ToothIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { timeString } from "../lib/utils";
import { ToastData } from "../MainEditor";
import { Dispatch, SetStateAction } from "react";

export default function ToastContent({
  toastData,
  setToastData,
}: {
  toastData: ToastData | null;
  setToastData: Dispatch<SetStateAction<ToastData | null>>;
}) {
  if (toastData?.estimatedDuration && toastData?.totalUploadDuration) {
    return (
      <div className="flex justify-between gap-x-2">
        <div className="italic flex flex-wrap w-full">
          {`Processing ${timeString(
            toastData.totalUploadDuration
          )} of video in estimated ${timeString(
            toastData.estimatedDuration
          )}...`}
          <Cog6ToothIcon className="size-5 animate-spin" />
          {toastData.estimatedDuration > 300 && (
            <p className="ml-auto">Grab some coffee? ☕</p>
          )}
        </div>
        <button onClick={() => setToastData(null)}>
          <XCircleIcon className="size-5" />
        </button>
      </div>
    );
  } else {
    return null;
  }
}
