"use client";

import { LiquidImageReveal } from "@/components/ui/LiquidImageReveal";

export function PhotoSection() {
  return (
    <section className="w-full bg-white py-32 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-24">
        <div className="flex flex-col items-center gap-4">
          <LiquidImageReveal
            src="/photos/cat.jpeg"
            alt="Get well soon kitten"
            className="w-full max-w-[400px] aspect-square rounded-lg shadow-sm"
            duration={2.5}
            frequency={0.03}
          />
        </div>

        {/* Optional second photo, slightly offset */}
        <div className="flex flex-col items-center gap-4 md:items-end md:-mr-12">
          <LiquidImageReveal
            src="/photos/flowers.png"
            alt="Get well soon flowers and band-aid"
            className="w-full max-w-[320px] aspect-[3/4] rounded-lg shadow-sm"
            duration={2.5}
            frequency={0.02}
          />
        </div>
      </div>
    </section>
  );
}
