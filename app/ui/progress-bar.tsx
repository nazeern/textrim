"use client";

import { useEffect, useState } from "react";

export default function ProgressBar({
  duration,
  height,
}: {
  duration: number;
  height: number;
}) {
  const progressPerSecond = Math.round((1 / duration) * 100);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const progressUpdateInterval = setInterval(() => {
      setProgress((progress) => {
        if (progress + progressPerSecond > 99) {
          clearInterval(progressUpdateInterval);
          return 99;
        } else {
          return progress + progressPerSecond;
        }
      });
    }, 1000);

    return () => {
      setProgress((progress) => 0);
      clearInterval(progressUpdateInterval);
    };
  }, []);

  return (
    <div className="flex items-center gap-x-1">
      <div className={`w-full h-${height} bg-gray-300 rounded-lg`}>
        <div
          className={`h-${height} bg-blue-500 rounded-lg`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm">{progress}%</p>
    </div>
  );
}
