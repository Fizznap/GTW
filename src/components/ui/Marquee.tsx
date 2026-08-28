"use client";

interface MarqueeProps {
  text: string;
}

export function Marquee({ text }: MarqueeProps) {
  // We repeat the text to ensure the marquee covers the screen seamlessly
  const repeatedText = Array(10).fill(text).join(" \u2022 ");

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm py-4 overflow-hidden border-y border-zinc-200">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <span className="text-zinc-900 font-outfit text-sm tracking-[0.2em] uppercase px-4">
          {repeatedText}
        </span>
        <span className="text-zinc-900 font-outfit text-sm tracking-[0.2em] uppercase px-4">
          {repeatedText}
        </span>
      </div>
    </div>
  );
}
