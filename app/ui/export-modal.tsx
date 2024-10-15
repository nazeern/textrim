import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import ReactPlayer from "react-player";

export function ExportModal({
  finalUrl,
  exportProgress,
}: {
  finalUrl: string;
  exportProgress: number;
}) {
  const loading = exportProgress != 100;
  const text = loading ? "Export in Progress" : "Export Complete!";
  const icon = loading ? (
    <ArrowPathIcon className="size-5 animate-spin" />
  ) : (
    <CheckIcon className="size-5" />
  );
  return (
    <div
      className="flex flex-col items-center gap-y-1 bg-white rounded-lg shadow-lg p-6 w-1/2"
      onClick={(e) => e.stopPropagation()}
    >
      {finalUrl && (
        <a
          href={finalUrl}
          target="_blank"
          download="output.mp4"
          className="bg-primary text-onprimary p-2 rounded"
        >
          Download
        </a>
      )}
      <div className="flex gap-x-1 items-center">
        <h3 className="text-lg font-semibold">{text}</h3>
        {icon}
      </div>
      {/* Loading bar */}
      <div className="w-full h-4 bg-gray-300 rounded-lg mb-4">
        <div
          className="h-4 bg-blue-500 rounded-lg"
          style={{ width: `${exportProgress}%` }}
        ></div>
      </div>
      <p className="text-sm">{exportProgress}%</p>
    </div>
  );
}
