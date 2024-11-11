"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const faqs = [
  {
    question: "What makes SimpleClip different?",
    answer:
      "I made SimpleClip because the alternatives were (1) too expensive, (2) unnecessarily complicated and (3) inconvenient. \
      SimpleClip is a video editor that puts your message and content first— not fancy color grading or unneeded AI features.",
  },
  {
    question: "Who is SimpleClip for?",
    answer:
      "SimpleClip is for anyone with a message to share, from content creators to educators. \
      Editing should not be a chore— it should be intuitive and simple. \
      As a content creator, the most tedious part of editing is rewatching clips over and over to cut out bad takes and silences.\
      SimpleClip takes care of this for you!",
  },
  {
    question: "Is SimpleClip free?",
    answer:
      "You get a full 50 minutes of transcription at no cost! \
      Try it out for your next shorts or videos, completely risk free. \
      We will never watermark your video, even on the free tier.",
  },
  {
    question: "Do I have to install anything?",
    answer:
      "Nope! SimpleClip runs entirely within your browser, and autosaves your work to your cloud. Work from any device, and from mobile!",
  },
  {
    question: "How does pricing work?",
    answer:
      "We offer three pricing options: (1) Pay as You Go, (2) Monthly, and (3) Yearly. \
      Pay as You Go is just $0.08 per minute, and is suited for solo creators. \
      A typical short costs just sixteen cents to edit!",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancel anytime!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white rounded-xl max-w-7xl w-full border-2 border-gray-300 py-8">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 py-1 px-8">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left text-3xl font-medium py-2 flex justify-between"
            >
              {faq.question}
              {index == openIndex ? (
                <ChevronUpIcon className="size-8 text-primary" />
              ) : (
                <ChevronDownIcon className="size-8 text-primary" />
              )}
            </button>
            {openIndex === index && (
              <p className="text-xl text-left text-gray-700 mt-2 px-4 pb-4 leading-10">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
