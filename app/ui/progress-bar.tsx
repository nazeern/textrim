"use client";

import { useEffect, useRef, useState } from "react";

export default function ProgressBar({
  duration,
  height,
}: {
  duration: number;
  height: number;
}) {
  const progressInterval = useRef<NodeJS.Timeout>();
  const progressPerSecond = (1 / duration) * 100;
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    progressInterval.current = setInterval(() => {
      setProgress((progress) => {
        if (progress + progressPerSecond > 99) {
          clearInterval(progressInterval.current);
          return 99;
        } else {
          return progress + progressPerSecond;
        }
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval.current);
      setProgress((progress) => 0);
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
      <p className="text-sm">{Math.round(progress)}%</p>
    </div>
  );
}
