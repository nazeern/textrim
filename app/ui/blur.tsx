export function BlurTop() {
  return (
    <div
      className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-visible blur-3xl sm:-top-80"
      aria-hidden="true"
    >
      <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4287f5] to-[#82b2ff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
    </div>
  );
}

export function BlurBottom() {
  return (
    <div
      className="fixed inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-visible blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true"
    >
      <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4287f5] to-[#82b2ff] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
    </div>
  );
}
