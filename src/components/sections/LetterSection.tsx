"use client";

import { motion } from "framer-motion";

export function LetterSection() {
  return (
    <section className="relative w-full bg-transparent py-24 md:py-32 px-6 md:px-12 flex justify-center items-center overflow-hidden z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-sm p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-200/60"
      >
        {/* Colorful Blue Squiggle */}
        <svg className="absolute top-10 left-6 md:left-10 w-12 h-12 text-sky-400 -rotate-12 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
          <path d="M10 50 Q 25 20, 40 50 T 70 50 T 100 50" />
        </svg>

        {/* Yellow Star */}
        <svg className="absolute top-8 right-8 md:right-12 w-10 h-10 text-amber-400 rotate-12 opacity-90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z" />
        </svg>



        <div className="relative font-caveat text-3xl md:text-5xl text-zinc-800 leading-[1.6] space-y-6 md:space-y-8 z-10">
          <p>
            Hey Dora the explorer,
          </p>
          <p>
            Your body clearly decided to take an unscheduled maintenance break. Bold move.
          </p>
          <p>
            While it's offline: eat something good, watch something dumb, and don't feel like you owe anyone anything right now — not energy, not replies, not chaos. All optional until you're back to full battery.
          </p>
          <p>
            Get well soon, seriously.
          </p>
          <p className="text-right mt-12 md:mt-16 text-2xl md:text-4xl text-zinc-600">
            — Smit
          </p>
        </div>
      </motion.div>
    </section>
  );
}
