"use client";

import { motion, useReducedMotion } from "framer-motion";

export function PlaylistSection() {
  const reduce = useReducedMotion();
  const tracks = [
    {
      id: "track-1",
      url: "https://open.spotify.com/embed/track/395gJWcJQK0C3GJfHAn7f6?utm_source=generator",
    },
    {
      id: "track-2",
      url: "https://open.spotify.com/embed/track/3hoXhwP0ub9LdSJV4olDIc?utm_source=generator",
    },
    {
      id: "track-3",
      url: "https://open.spotify.com/embed/track/7eQl3Yqv35ioqUfveKHitE?utm_source=generator",
    },
    {
      id: "track-4",
      url: "https://open.spotify.com/embed/track/5a11x5PUFvJEadMRqtNtTr?utm_source=generator",
    },
  ];

  return (
    <section className="w-full bg-transparent py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        <motion.div 
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/3 flex flex-col pt-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-zinc-900 tracking-tight leading-tight">
            Curated <br/>for you.
          </h2>
          <p className="mt-4 text-zinc-400 font-light text-lg max-w-sm">
            Something to listen to while you rest.
            <span className="block mt-4 text-zinc-500 text-base">
              (Just play it out loud — give your ears a break from earphones for a bit 🎧)
            </span>
          </p>
        </motion.div>

        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <iframe
                src={track.url}
                width="100%"
                height="352"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl border border-zinc-100 bg-zinc-50"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
