"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface TextBlockEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blockColor?: string;
}

export function TextBlockEffect({
  children,
  className,
  blockColor = "#e8a0bf",
  ...props
}: TextBlockEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Clean up any previous splits in case of HMR/StrictMode
      containerRef.current.querySelectorAll('.block-sweep').forEach(el => el.remove());

      const splitText = new SplitType(containerRef.current, {
        types: "lines",
        lineClass: "overflow-hidden relative inline-flex pb-[0.2em] leading-tight",
      });

      const lines = splitText.lines;
      if (!lines) return;

      const blocks: HTMLDivElement[] = [];

      lines.forEach((line) => {
        const contentSpan = document.createElement("span");
        contentSpan.innerHTML = line.innerHTML;
        contentSpan.style.opacity = "0";
        
        line.innerHTML = "";
        line.appendChild(contentSpan);

        const block = document.createElement("div");
        block.className = 'block-sweep';
        block.style.position = "absolute";
        block.style.top = "0";
        block.style.left = "0";
        block.style.width = "100%";
        block.style.height = "100%";
        block.style.backgroundColor = blockColor;
        block.style.transformOrigin = "left";
        block.style.transform = "scaleX(0)";
        block.style.zIndex = "1";

        line.appendChild(block);
        blocks.push(block);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.to(blocks, {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.inOut",
      });

      tl.set(lines.map((l) => l.querySelector("span")), { opacity: 1 });

      tl.to(
        blocks,
        {
          scaleX: 0,
          transformOrigin: "right",
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.inOut",
        },
        "-=0.2"
      );

      return () => {
        splitText.revert();
      };
    },
    { scope: containerRef, dependencies: [blockColor] }
  );

  return (
    <div ref={containerRef} className={cn("text-balance", className)} {...props}>
      {children}
    </div>
  );
}
