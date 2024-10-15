import { BlurBottom, BlurTop } from "@/app/ui/blur";
import Navbar from "@/app/ui/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <div>
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <BlurTop />
          <div className="h-screen bg-background flex flex-col items-center my-12">
            {children}
          </div>
          <BlurBottom />
        </div>
      </div>
    </div>
  );
}
