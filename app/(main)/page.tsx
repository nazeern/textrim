import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Testimonials from "../ui/testimonials";
import HowItWorksRow from "../ui/how-it-works";
import FAQ from "../ui/faq";

const bullets = ["Get started for free", "Zero install needed"];

export default async function Landing() {
  return (
    <div className="w-full max-w-7xl flex flex-col items-center gap-y-4 py-16 md:py-24 px-2 text-center">
      <p className="text-5xl md:text-7xl font-medium mb-4">
        Create content in{" "}
        <span className="underline decoration-primary">minutes.</span>
      </p>
      <p className="text-xl md:text-2xl font-medium w-full max-w-2xl mb-12 leading-loose">
        SimpleClip is the editor for non-editors. User friendly and lightweight
        by design, so you can focus on what matters.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/sign-up"
          className="rounded-lg py-2 px-4 bg-blue-600 text-onprimary text-center hover:border hover:border-primarybg hover:bg-primaryhov hover:-translate-y-1 duration-300"
        >
          Start Editing &rarr;
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg py-2 px-4 bg-gray-300 text-center hover:border hover:border-primarybg hover:bg-gray-300/50 hover:-translate-y-1 duration-300"
        >
          See Pricing
        </Link>
      </div>
      <div className="flex flex-col gap-y-1 mb-24">
        {bullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center gap-x-1">
              <CheckCircleIcon className="stroke-2 size-5 text-green-700 shrink-0" />
              <p className="text-md text-gray-700">{bullet}</p>
            </div>
          );
        })}
      </div>
      {/* <video className="w-full h-auto" autoPlay loop muted playsInline>
        Your browser does not support the video tag.
      </video> */}
      {/* How It Works */}
      <HowItWorksRow
        index={1}
        title="UPLOAD YOUR FOOTAGE"
        subtitle="Upload directly from mobile & autosave to cloud. No more complicated file transfers and digging through folders."
        imagePath="PhoneImage.jpg"
        alt="Shooting Video with Mobile"
      />
      <HowItWorksRow
        index={2}
        title="EDIT LIKE A DOC"
        subtitle="Cut out bad takes and pauses by deleting text from the transcript— no need to scrub through an editor to find the perfect line."
        imagePath="Example.jpg"
        alt="Example of SimpleClip Editor"
      />
      <HowItWorksRow
        index={3}
        title="EXPORT AND POST"
        subtitle="Export & share your finished product, or apply final touches."
        imagePath="Editor.jpg"
        alt="Exporting & Editing Video"
      />
      <p className="text-5xl mt-48 mb-12">What Our Users are Saying</p>
      <Testimonials />
      <p className="text-5xl mt-48 mb-8">Frequently Asked Questions</p>
      <FAQ />
      <p className="text-xl md:text-7xl font-medium mt-24 mb-4">
        Create content in{" "}
        <span className="underline decoration-primary">minutes.</span>
      </p>
      <p className="text-2xl md:text-4xl font-medium w-full max-w-2xl mb-12 leading-loose">
        Get started for free!
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/sign-up"
          className="rounded-lg py-2 px-4 bg-blue-600 text-onprimary text-center hover:border hover:border-primarybg hover:bg-primaryhov hover:-translate-y-1 duration-300"
        >
          Start Editing &rarr;
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg py-2 px-4 bg-gray-300 text-center hover:border hover:border-primarybg hover:bg-gray-300/50 hover:-translate-y-1 duration-300"
        >
          See Pricing
        </Link>
      </div>
      <div className="flex flex-col gap-y-1 mb-24">
        {bullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center gap-x-1">
              <CheckCircleIcon className="stroke-2 size-5 text-green-700 shrink-0" />
              <p className="text-md text-gray-700">{bullet}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
