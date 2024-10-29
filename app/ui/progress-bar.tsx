"use client";

import { useEffect, useRef, useState } from "react";

const ticksPerSecond = 7;

export default function ProgressBar({
  duration,
  height,
}: {
  duration: number;
  height: number;
}) {
  const progressInterval = useRef<number | undefined>();
  const progressPerTick = ((1 / duration) * 100) / ticksPerSecond;
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setProgress(0);
    progressInterval.current = window.setInterval(() => {
      setProgress((progress) => {
        if (progress + progressPerTick > 99) {
          clearInterval(progressInterval.current);
          return 99;
        } else {
          return progress + progressPerTick;
        }
      });
    }, 1000 / ticksPerSecond);

    return () => {
      window.clearInterval(progressInterval.current);
      setProgress(0);
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
