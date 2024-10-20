import Navbar from "@/app/ui/navbar";
import { BlurBottom, BlurTop } from "@/app/ui/blur";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="static inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <div>
        <BlurTop />
        <div className="h-screen bg-background flex flex-col items-center pt-12">
          {children}
        </div>
        <BlurBottom />
      </div>
    </div>
  );
}
