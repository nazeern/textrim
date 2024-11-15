import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import ReactPlayer from "react-player";
import { Plan } from "./plan-card";
import { cn, round } from "../lib/utils";
import Link from "next/link";
import UpsellModal from "./upsell-modal";

export function ExportModal({
  finalUrl,
  exportProgress,
  exportDuration,
  minutesRemaining,
  plan,
  captionsUrl,
  createCaptions,
}: {
  finalUrl: string;
  exportProgress: number;
  exportDuration: string;
  minutesRemaining: number;
  plan: Plan;
  captionsUrl: string;
  createCaptions: () => void;
}) {
  const loading = exportProgress != 100;
  const text = loading ? "Export in Progress" : "Export Complete!";
  const icon = loading ? (
    <ArrowPathIcon className="size-5 animate-spin" />
  ) : (
    <CheckIcon className="size-5" />
  );
  const buffer = Math.ceil(exportProgress / 5) * 5;
  return (
    <div
      className="flex flex-col items-center gap-y-1 bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-3 items-center">
        <a
          href={finalUrl}
          target="_blank"
          download="output.mp4"
          className={cn("bg-primary text-onprimary p-2 rounded", {
            "pointer-events-none bg-blue-400": !finalUrl,
          })}
        >
          Download
        </a>
        <a
          onClick={createCaptions}
          href={captionsUrl}
          target="_blank"
          download="captions.srt"
          className={cn("bg-primary text-onprimary p-2 rounded", {
            "pointer-events-none bg-blue-400": captionsUrl === "loading",
          })}
        >
          Captions
        </a>
      </div>
      <div className="flex gap-x-1 items-center">
        <h3 className="text-lg font-semibold">{text}</h3>
        {icon}
      </div>
      {/* Loading bar */}
      <div className="relative w-full h-6 bg-gray-300 rounded-lg mb-2">
        <div
          className="absolute h-6 bg-gray-400 rounded-lg"
          style={{
            width: `${buffer}%`,
          }}
        />
        <div
          className="absolute h-6 bg-blue-500 rounded-lg text-right pr-2 text-onprimary"
          style={{ width: `${exportProgress}%` }}
        >
          {exportProgress > 5 && `${exportProgress}%`}
        </div>
      </div>
      <p className="text-sm mb-12">
        {`Expected duration:`}
        <span className="ml-2 italic">{exportDuration}</span>
      </p>
      {plan == Plan.FREE && (
        <UpsellModal
          title="Wow, that was some nice editing."
          subtitle="Upgrade now and create content in minutes, not hours."
          minutesRemaining={minutesRemaining}
        />
      )}
    </div>
  );
}
