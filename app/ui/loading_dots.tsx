export default function LoadingDots() {
  return (
    <div
      className="border border-primary bg-blue-100 rounded-full size-10 flex justify-center items-center
          text-primary hover:border-complement"
    >
      {/* Loading Dots */}
      <div className="flex gap-x-1">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </div>
  );
}
