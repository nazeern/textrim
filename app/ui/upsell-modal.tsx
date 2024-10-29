import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { cn, round } from "../lib/utils";
import { useEffect, useState } from "react";

export default function UpsellModal({
  title,
  subtitle,
  minutesRemaining,
}: {
  title: string;
  subtitle: string;
  minutesRemaining: number;
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);
  return (
    <div
      className={cn(
        "flex flex-col items-center w-full rounded-lg bg-purple-300 py-8 px-6 md:px-12 gap-y-1 transform transition-opacity duration-1000",
        {
          "opacity-100": isVisible,
          "opacity-0 pointer-events-none": !isVisible,
        }
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-center text-3xl font-semibold">{title}</p>
      <p className="text-center text-lg mb-4">{subtitle}</p>
      <a
        href="/pricing"
        target="_blank"
        className="flex items-center gap-x-2 border bg-purple-500 rounded-md
      text-onprimary text-xl hover:border-complement px-2 py-1 mb-2"
      >
        Upgrade
        <ArrowTopRightOnSquareIcon className="stroke-onprimary size-4" />
      </a>
      {/* Bullets */}
      <div className="md:text-lg flex items-center italic itme">
        <CheckBadgeIcon className="text-green-600 size-4 mr-3" />
        <span className="line-through mr-1">{round(minutesRemaining, 0)}</span>
        <span className="italic font-bold mr-1">unlimited</span>
        transcribe minutes
      </div>
      <div className="md:text-lg flex items-center italic">
        <CheckBadgeIcon className="text-green-600 size-4 mr-3" />
        Just <span className="font-bold mx-1">$0.08</span> per minute
      </div>
      <div className="md:text-lg flex items-center italic">
        <CheckBadgeIcon className="text-green-600 size-4 mr-3" />
        Export in 4k video
      </div>
    </div>
  );
}
