"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const text = new SplitType(containerRef.current.querySelectorAll('.split-text'), {
      types: 'lines,words',
      lineClass: 'overflow-hidden',
      wordClass: 'translate-y-full opacity-0 inline-block',
    });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(text.words, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.04,
      ease: "expo.out",
    });

    return () => text.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[100dvh] bg-transparent overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-24"
    >
      {/* Subtle background bleed */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-rose-50 blur-3xl mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
        <h1 className="split-text text-6xl md:text-8xl lg:text-[140px] font-medium tracking-tighter text-zinc-900 leading-[0.9] mb-6 md:mb-0">
          Get well soon,<br/>Dora.
        </h1>
        
        <p className="split-text text-xl md:text-2xl font-light text-rose-400 max-w-sm leading-relaxed mb-2 md:mb-6">
          Take your time. Rest as much as you actually need.
        </p>
      </div>
    </section>
  );
}
