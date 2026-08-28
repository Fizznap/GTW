"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ExpandablePlaylistProps {
  className?: string;
  tracks: { id: string; url: string }[];
}

export function ExpandablePlaylist({ className, tracks }: ExpandablePlaylistProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-6 flex items-center justify-between border-b border-gray-200 group transition-all duration-300 hover:border-[#e8a0bf]"
      >
        <span className="text-sm font-medium tracking-wide text-gray-500 group-hover:text-[#1a1a1a] transition-colors duration-300">
          tap to play something for you ♪
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="text-gray-400 group-hover:text-[#e8a0bf] transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-rose-50"
        >
          ↓
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2 space-y-4">
              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <iframe
                    key={track.id}
                    src={track.url}
                    width="100%"
                    height="152"
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl border-0"
                  />
                ))
              ) : (
                <div className="text-sm text-gray-400 italic text-center py-4">
                  playlist coming soon...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
