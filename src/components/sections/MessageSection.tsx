"use client";

import { TextBlockEffect } from "@/components/ui/TextBlockEffect";

export function MessageSection() {
  return (
    <section className="w-full bg-white py-32 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        {/* Option A: Warm & Simple message */}
        <TextBlockEffect 
          blockColor="#e8a0bf" 
          className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a1a] leading-relaxed tracking-wide"
        >
          <p className="mb-8">
            You've always brought so much color into everyone else's world.
          </p>
          <p className="mb-8">
            Right now, it's okay to just rest and let the world be a little quiet for you.
          </p>
          <p>
            Take all the time you need. We're right here when you're ready.
          </p>
        </TextBlockEffect>
      </div>
    </section>
  );
}
