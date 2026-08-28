"use client";

import React, { useRef, useId } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface LiquidImageRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  frequency?: number;
  duration?: number;
}

export function LiquidImageReveal({
  src,
  alt,
  frequency = 0.02,
  duration = 2.5,
  className,
  ...props
}: LiquidImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const filterId = useId();

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;

      // Note: CSS.escape or regex is needed because React useId generates strings with colons (e.g. :r1:)
      const filterSelector = `#${filterId.replace(/:/g, "\\:")} feDisplacementMap`;
      const displacementMap = document.querySelector(filterSelector);

      if (!displacementMap) return;

      gsap.set(displacementMap, { attr: { scale: 100 } });
      gsap.set(imageRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.to(imageRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }).to(
        displacementMap,
        {
          attr: { scale: 0 },
          duration: duration,
          ease: "power2.out",
        },
        "-=0.5"
      );
    },
    { scope: containerRef, dependencies: [duration, filterId] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden group hover:shadow-xl transition-shadow duration-700",
        className
      )}
      {...props}
    >
      <svg className="hidden absolute inset-0 h-0 w-0 pointer-events-none">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves="3" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="100"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        style={{ filter: `url(#${filterId})` }}
      />
    </div>
  );
}
