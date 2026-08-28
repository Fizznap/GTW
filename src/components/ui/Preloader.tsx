"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Hide preloader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Animate progress to 100 reliably based on real time
    const startTime = Date.now();
    const duration = 2000; // Hit 100% in 2 seconds
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);
      
      if (currentProgress >= 100) clearInterval(interval);
    }, 20);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const columns = 5;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex h-[100dvh]">
          {/* Staggered Background Columns */}
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.08, // Stagger delay
              }}
              className="w-full h-full bg-zinc-900 border-r border-zinc-800/30 last:border-none"
            />
          ))}

          {/* Center text content */}
          <motion.div
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-rose-400 font-outfit font-light text-6xl md:text-8xl tabular-nums"
              >
                {progress}%
              </motion.div>
              
              {/* Loading bar */}
              <div className="w-48 h-[1px] bg-zinc-800 mt-4 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-full h-full bg-rose-400"
                />
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-zinc-500 text-sm font-outfit mt-2 tracking-widest uppercase"
              >
                Please stand by
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
