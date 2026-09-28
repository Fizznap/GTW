"use client";

import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  color: string;
  opacity: number;
  shape: "rect" | "circle";
}

const PALETTE = [
  "#fb7185", // rose-400
  "#fda4af", // rose-300
  "#f43f5e", // rose-500
  "#fbbf24", // amber-400
  "#38bdf8", // sky-400
  "#a78bfa", // violet-400
  "#34d399", // emerald-400
];

export function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create ~65 confetti pieces for a light, tasteful burst
    const pieceCount = 65;
    const pieces: ConfettiPiece[] = [];

    const originX = width / 2;
    const originY = height * 0.52;

    for (let i = 0; i < pieceCount; i++) {
      const angle = (Math.PI * (180 + (Math.random() * 160 - 80))) / 180;
      const speed = 6 + Math.random() * 10;
      pieces.push({
        x: originX + (Math.random() * 30 - 15),
        y: originY + (Math.random() * 20 - 10),
        w: 6 + Math.random() * 5,
        h: 4 + Math.random() * 6,
        vx: Math.cos(angle) * speed + (Math.random() * 4 - 2),
        vy: -Math.abs(Math.sin(angle) * speed) - 3.5,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let animationId: number;
    let startTime: number | null = null;
    const duration = 2800;

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gentle gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.vRot;

        if (progress > 0.6) {
          p.opacity = Math.max(0, 1 - (progress - 0.6) / 0.4);
        }

        if (p.opacity > 0 && p.y < height + 40) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < duration) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
