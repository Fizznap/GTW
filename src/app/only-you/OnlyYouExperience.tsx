 "use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Heart,
  Music2,
  Sparkles,
  Volume2,
} from "lucide-react";

const chapters = [
  {
    number: "01",
    eyebrow: "It started quietly",
    title: "The little things",
    body: "Somewhere between the ordinary conversations and the smallest moments, you became someone I started looking forward to.",
    note: "Funny how the smallest things can become your favourite things.",
    symbol: "✳",
  },
  {
    number: "02",
    eyebrow: "A feeling I couldn't ignore",
    title: "Your kind of magic",
    body: "It's the way you make simple things feel lighter. The way a random message can turn an ordinary day into a better one.",
    note: "You have a way of making ordinary moments feel a little golden.",
    symbol: "✧",
  },
  {
    number: "03",
    eyebrow: "Things left unsaid",
    title: "A thousand unsent words",
    body: "I kept waiting for the perfect moment and the perfect words. Maybe there aren't any. Maybe being honest is enough.",
    note: "So here's me, choosing honesty over another almost-moment.",
    symbol: "♡",
  },
  {
    number: "04",
    eyebrow: "No more hiding it",
    title: "So, here's the truth",
    body: "I like you. Not as a passing thought or a pretty sentence. I genuinely care about you, and I wanted you to know.",
    note: "No pressure. No expectations. Just something real.",
    symbol: "♥",
  },
  {
    number: "05",
    eyebrow: "The part that matters",
    title: "Only you",
    body: "I don't expect a perfect answer or a promise. I just wanted to leave you with something true: if I ever get to choose, I'll choose you. Every single time.",
    note: "Whatever happens next, I'm glad I got to tell you.",
    symbol: "✿",
  },
];

export default function OnlyYouExperience() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const chapter = chapters[active];

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  const next = () => setActive((value) => Math.min(value + 1, chapters.length - 1));
  const previous = () => setActive((value) => Math.max(value - 1, 0));

  return (
    <main className="onlyyou">
      <div className="oy-grain" aria-hidden="true" />
      <header className="oy-topbar">
        <a className="oy-wordmark" href="/only-you" aria-label="Only You home">
          <span className="oy-wordmark-heart">♡</span> a little something
        </a>
        <span className="oy-topbar-note">made with a little courage</span>
      </header>

      {!started ? (
        <section className="oy-opening">
          <div className="oy-orbit oy-orbit-one" aria-hidden="true" />
          <div className="oy-orbit oy-orbit-two" aria-hidden="true" />
          <motion.div
            className="oy-opening-card"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <span className="oy-kicker"><Sparkles size={14} /> A small note for you</span>
            <div className="oy-big-heart" aria-hidden="true"><Heart size={42} strokeWidth={1.1} /></div>
            <p className="oy-overline">there's something</p>
            <h1>I wanted<br /><em>you</em> to know.</h1>
            <p className="oy-opening-copy">
              Nothing complicated. Just a few words that have been waiting for their moment.
            </p>
            <button className="oy-primary-button" onClick={() => setStarted(true)}>
              Take a little look <ArrowRight size={16} />
            </button>
            <span className="oy-scroll-hint"><ArrowDown size={13} /> take your time</span>
          </motion.div>
          <span className="oy-side-caption oy-side-left">A NOTE FROM THE HEART</span>
          <span className="oy-side-caption oy-side-right">01 — 05</span>
        </section>
      ) : (
        <section className="oy-story">
          <div className="oy-story-heading">
            <span className="oy-kicker"><Sparkles size={14} /> A little story</span>
            <p>Some things are better said gently.</p>
          </div>

          <div className="oy-progress" aria-label={`Chapter ${active + 1} of ${chapters.length}`}>
            {chapters.map((item, index) => (
              <button
                key={item.number}
                className={`oy-progress-step ${index <= active ? "is-active" : ""}`}
                onClick={() => setActive(index)}
                aria-label={`Go to chapter ${index + 1}`}
              />
            ))}
          </div>

          <div className="oy-chapter-layout">
            <div className="oy-chapter-index">
              <span>CHAPTER</span>
              <strong>{chapter.number}</strong>
              <i>{chapter.symbol}</i>
            </div>

            <div className="oy-chapter-content">
              <AnimatePresence mode="wait">
                <motion.article
                  key={chapter.number}
                  className="oy-chapter"
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                  transition={transition}
                >
                  <span className="oy-eyebrow">{chapter.eyebrow}</span>
                  <h2>{chapter.title}</h2>
                  <p className="oy-chapter-body">{chapter.body}</p>
                  <div className="oy-handwritten">{chapter.note}</div>
                  <div className="oy-chapter-flourish" aria-hidden="true">✳　♡　✳</div>
                </motion.article>
              </AnimatePresence>

              <div className="oy-navigation">
                <button className="oy-back-button" onClick={previous} disabled={active === 0}>
                  <ArrowLeft size={15} /> Back
                </button>
                <span className="oy-page-count">{String(active + 1).padStart(2, "0")} <i>/</i> 05</span>
                {active < chapters.length - 1 ? (
                  <button className="oy-primary-button oy-next-button" onClick={next}>
                    Next chapter <ArrowRight size={15} />
                  </button>
                ) : (
                  <a className="oy-primary-button oy-next-button" href="#song">
                    One more thing <Heart size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="oy-song" id="song">
        <div className="oy-song-copy">
          <span className="oy-kicker"><Music2 size={14} /> A song for this moment</span>
          <h2>Some feelings<br /><em>sound better.</em></h2>
          <p>Press play, take a breath, and let the music do a little of the talking.</p>
          <span className="oy-song-foot"><Volume2 size={14} /> Spotify player</span>
        </div>
        <div className="oy-player-wrap">
          <iframe
            title="Spotify playlist"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX7gIoKXt0gmx?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <span className="oy-player-caption">You can replace this playlist with your own Spotify embed.</span>
        </div>
      </section>

      <footer className="oy-footer">
        <span className="oy-footer-flower">✿</span>
        <p>That's all I wanted to say.</p>
        <h2>With a little bit of <em>heart.</em></h2>
        <span className="oy-footer-small">END OF NOTE · MADE WITH CARE</span>
      </footer>
    </main>
  );
}
