import { Fragment } from "react";
import QuoteMark from "../icons/quote-icon";
import {
  BanknotesIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const testimonials = [
  {
    icon: ClockIcon,
    header: "Saves Time",
    quote:
      "Between scripting, shooting, & editing, creating a 2 minute short used to take over an hour every day— with SimpleClip, this is just 15 minutes.",
  },
  {
    icon: BanknotesIcon,
    header: "Saves Money",
    quote:
      "I post 10 minute videos every single week, and SimpleClip still ends up being just $5 a month— $0.08 per minute is very reasonable.",
  },
  {
    icon: SparklesIcon,
    header: "Saves Your Sanity",
    quote:
      "Upload from mobile, edit in minutes, and export— this is as easy as it gets. I pair it with Capcut for final touches!",
  },
];

export default async function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <div className="flex items-center justify-center gap-x-2 mb-1 text-gray-700">
            <testimonial.icon className="size-10" />
            <h3 className="italic text-2xl font-bold">{testimonial.header}</h3>
          </div>
          {/* Main Card */}
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300">
            <QuoteMark className="size-10 mx-auto fill-primary mb-4" />
            <p className="font-medium text-2xl leading-loose">
              {testimonial.quote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
