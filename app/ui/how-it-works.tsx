export default async function HowItWorksRow({
  index,
  title,
  subtitle,
  imagePath,
  alt,
}: {
  index: number;
  title: string;
  subtitle: string;
  imagePath: string;
  alt: string;
}) {
  return (
    <div className="w-full flex items-center flex-wrap my-12">
      <div className="md:w-2/3 flex flex-col items-center justify-center gap-4 p-6">
        {/* Title */}
        <div className="w-full flex justify-between items-center gap-3">
          <div className="shrink-0 size-20 flex justify-center items-center border-2 border-primary bg-primarybg rounded-xl">
            <p className="text-5xl text-primary font-bold">{index}</p>
          </div>
          <div className="grow">
            <p className="font-bold text-3xl md:text-5xl text-center">
              {title}
            </p>
          </div>
        </div>
        {/* Subtitle */}
        <p className="text-lg md:ml-20 leading-loose">{subtitle}</p>
      </div>
      <div className="flex grow items-center justify-center w-1/3 rounded-xl">
        <img src={imagePath} alt={alt} className="rounded-3xl shadow-2xl" />
      </div>
    </div>
  );
}
