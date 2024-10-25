export default async function Landing() {
  return (
    <div className="flex flex-col gap-y-12">
      <p className="font-bold text-lg">
        SimpleClip is a browser-based video editor that makes it quick and easy
        to upload and edit video, even for beginners.
      </p>
      <p className="font-bold text-lg">
        Users can choose their pricing plan from these options:
      </p>
      <ol>
        <li>(1) Pay as you go: $0.08 per minute transcribed</li>
        <li>(2) Monthly: $12 per month</li>
        <li>(3) Yearly: $39 per year (special beta deal)</li>
      </ol>
      <p>
        See the official Github repository!{" "}
        <a href="https://github.com/nazeern/textrim">(click here)</a>
      </p>
      <p>
        A good example of a landing page (link):{" "}
        <a href="https://supabase.com/">Supabase Landing Page</a>
        <br />
        But with the blue color scheme
      </p>
    </div>
  );
}
