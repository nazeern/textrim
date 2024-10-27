import Link from "next/link";
import { cn } from "../lib/utils";
import { signup } from "../lib/actions";
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export enum Plan {
  FREE = 0,
  USAGE = 1,
  MONTHLY = 2,
  YEARLY = 3,
}

export namespace Plan {
  export function fromPlanString(planString?: string): Plan {
    switch (planString) {
      case "pay-as-you-go":
        return Plan.USAGE;
      case "monthly":
        return Plan.MONTHLY;
      case "yearly":
        return Plan.YEARLY;
      default:
        return Plan.FREE;
    }
  }
}

type PlanDetails = {
  title: string;
  description: string;
  tag?: string;
  featured?: boolean;
  linkTo: string;
  linkText: string;
  price: string;
  per: string;
  originalPrice?: string;
  percentOff?: string;
  includedMinutes?: string;
  bulletHeader: string;
  bullets: string[];
};

const renderData: { [key in Plan]: PlanDetails } = {
  [Plan.FREE]: {
    title: "Free",
    description: "Perfect for getting started with content creation.",
    linkTo: "/projects",
    linkText: "Edit for free",
    price: "$0",
    per: "/ month",
    includedMinutes: undefined,
    bulletHeader: "Get started with:",
    bullets: [
      "First 50 minutes free",
      "Export in 1080p",
      "No watermarks",
      "Work from any device with Cloud Sync",
      "Upload & transcribe from mobile",
    ],
  },
  [Plan.USAGE]: {
    title: "Pay as you Go",
    description: "Low per-minute rates. Don't use it? Don't pay.",
    tag: "Most Popular",
    featured: true,
    linkTo: "/upgrade?plan=pay-as-you-go",
    linkText: "Start Editing",
    price: "$0.08",
    per: "/ minute transcribed",
    includedMinutes: undefined,
    bulletHeader: "Everything in the Free Plan, plus:",
    bullets: [
      "Unlimited transcribe minutes",
      "Export in 4k",
      "No watermarks",
      "Work from any device with Cloud Sync",
      "Upload & transcribe from mobile",
    ],
  },
  [Plan.MONTHLY]: {
    title: "Monthly",
    description:
      "For creators who consistently create 40 minutes of content every week.",
    linkTo: "/upgrade?plan=monthly",
    linkText: "Start Editing",
    price: "$12",
    per: "/ month",
    includedMinutes: undefined,
    bulletHeader: "Everything in the Free Plan, plus:",
    bullets: [
      "1,000 transcribe minutes every month",
      "Export in 4k",
      "No watermarks",
      "Work from any device with Cloud Sync",
      "Upload & transcribe from mobile",
    ],
  },
  [Plan.YEARLY]: {
    title: "Yearly",
    description: "A special yearly discount for our first 100 users!",
    linkTo: "/upgrade?plan=yearly",
    linkText: "Start Editing",
    tag: "Limited Beta Deal!",
    price: "$39",
    per: "/ year",
    originalPrice: "$144",
    percentOff: "Save 73%",
    includedMinutes: undefined,
    bulletHeader: "Everything in the Free Plan, plus:",
    bullets: [
      "1,000 transcribe minutes every month",
      "Export in 4k",
      "No watermarks",
      "Work from any device with Cloud Sync",
      "Upload & transcribe from mobile",
    ],
  },
};

export default async function PlanCard({
  plan,
  userId,
}: {
  plan: Plan;
  userId?: string;
}) {
  const data = renderData[plan];
  const signupSearchParams = new URLSearchParams();
  signupSearchParams.set("redirectTo", data.linkTo);
  // if user, send to upgrade, else signup then redirect to upgrade
  const linkTo = userId
    ? data.linkTo
    : `/sign-up?${signupSearchParams.toString()}`;
  return (
    <div
      className={cn(
        "xl:mt-12 h-fit p-8 rounded-lg border border-gray-400 bg-white",
        {
          "border-primary border-2": data.featured,
          "xl:mt-0": data.tag,
        }
      )}
    >
      {data.tag && (
        <div className="w-fit rounded-md border border-primary text-primary text-sm px-1 mb-2">
          {data.tag}
        </div>
      )}
      <p className="font-bold text-3xl mb-3">{data.title}</p>
      <p className="text-sm mb-4 font-light">{data.description}</p>
      {/* Subscribe CTA Button */}
      {data.tag && <div className="xl:h-4" />}
      <Link href={linkTo}>
        <div className="rounded-lg w-full p-2 bg-primary text-onprimary text-center border border-primarybg mb-5">
          {data.linkText} &rarr;
        </div>
      </Link>
      {/* Percent Off */}
      {data.percentOff ? (
        <div className="flex items-center gap-x-2 mb-2">
          <div className="line-through text-gray-500">{data.originalPrice}</div>
          <div className="font-semibold w-fit rounded-full bg-primarybg text-primary text-sm px-2 py-1">
            {data.percentOff}
          </div>
        </div>
      ) : (
        <div className="h-9" />
      )}
      {/* Pricing */}
      <div className="flex items-end gap-x-2 mb-3">
        <p className="text-5xl">{data.price}</p>
        <p className="text-sm">{data.per}</p>
      </div>
      <hr className="w-full border-b border-gray-300 my-8" />
      {/* Bullets */}
      <p className="text-sm font-light mb-4">{data.bulletHeader}</p>
      <div className="flex flex-col gap-y-4">
        {data.bullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center gap-x-1">
              <CheckCircleIcon className="stroke-2 size-4 text-green-700 shrink-0" />
              <p className="text-sm">{bullet}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
