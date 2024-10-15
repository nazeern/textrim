import { BlurTop, BlurBottom } from "./ui/blur";

export default function LoadingPage() {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      {/* Loading Dots */}
      <div className="flex gap-x-2">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
      <p>Loading...</p>
      <BlurTop />
      <BlurBottom />
    </div>
  );
}
