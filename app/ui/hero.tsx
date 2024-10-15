import Link from "next/link";

export default function Hero() {
  return (
    <div className="mx-auto max-w-2xl py-32 lg:py-42">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Announcing our next round of funding.{" "}
          <a href="#" className="font-semibold text-primary">
            <span className="absolute inset-0" aria-hidden="true"></span>
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-12">
          Everything starts with a great idea
        </h1>
        <div className="border border-primary hover:border-complement rounded-3xl md:rounded-full p-4 mb-4 shadow transition hover:-translate-y-1">
          <Link href="/posts">
            <p className="text-xl font-bold text-primary">
              Need inspiration? &rarr;
            </p>
            <p className="text-md leading-8 text-gray-600">
              View popular ideas from our community of entrepreneurs and
              innovators.
            </p>
          </Link>
        </div>
        <div className="border border-primary hover:border-complement rounded-3xl md:rounded-full p-4 shadow transition hover:-translate-y-1">
          <Link href="sign-up">
            <p className="text-xl font-bold text-primary">
              Feeling inspired? &rarr;
            </p>
            <p className="text-md leading-8 text-gray-600">
              Get feedback and gauge user interest before investing time and
              money on product.
            </p>
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/sign-up"
            className="rounded-full bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primaryhov focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
