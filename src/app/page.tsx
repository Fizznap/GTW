import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { GallerySection } from "@/components/sections/GallerySection";
import { PlaylistSection } from "@/components/sections/PlaylistSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Marquee text="GET WELL SOON DORA" />
      <GallerySection />
      <PlaylistSection />
      <Footer />
    </main>
  );
}
