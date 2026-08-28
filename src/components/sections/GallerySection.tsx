"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function GallerySection() {
  const reduce = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative w-full bg-transparent py-24 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center"
      >
        {/* Left Column: Cat Image */}
        <motion.div variants={item} className="md:col-span-5 md:col-start-1">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-zinc-50">
            <Image 
              src="/photos/cat.jpeg" 
              alt="Cat" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </motion.div>

        {/* Center/Right Column: Message Bento 1 */}
        <motion.div variants={item} className="md:col-span-6 md:col-start-7 flex flex-col gap-8 text-2xl md:text-4xl font-light text-zinc-900 leading-relaxed md:leading-snug mt-12 md:mt-0 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-[2rem] p-8 md:p-12 shadow-sm relative">
          <p className="relative z-10">
            Looks like your body just needed a little rest from being too awesome 😄
          </p>
          <p className="text-zinc-500 relative z-10">
            Or maybe you got a small excuse to relax for a while — not the worst thing.
          </p>
        </motion.div>



        {/* Left Column: Biceps Image */}
        <motion.div variants={item} className="md:col-span-5 md:col-start-2 mt-12 md:mt-32">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-zinc-50">
            <Image 
              src="/photos/biceps_art.jpg" 
              alt="Biceps" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end pb-6 text-center pointer-events-none">
              <p className="text-zinc-800 text-2xl md:text-3xl leading-snug font-medium drop-shadow-sm">
                may all your problems<br/>
                go straight to my bicpes<br/>
                so it will grow bigger
              </p>
            </div>
          </div>
        </motion.div>

        {/* Center/Right Column: Funny Message Bento 2 */}
        <motion.div variants={item} className="md:col-span-4 md:col-start-8 flex flex-col justify-center text-xl md:text-3xl font-light text-zinc-900 leading-relaxed md:leading-snug mt-12 md:mt-48 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-[2rem] p-8 md:p-10 shadow-sm relative">
          <p className="text-zinc-800 font-caveat text-4xl md:text-5xl relative z-10">
            Take good care, rest well, and get well soon. No rush at all.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
