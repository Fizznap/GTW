 "use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Sparkles } from "lucide-react";

const pages = [
  {
    date: "A LITTLE CONFESSION",
    salutation: "Dear my favourite person,",
    paragraphs: [
      "If you ever say that the girl who will marry me will be so lucky, I'll tell you one thing…",
      "Koi aur dooja kyun mujhe chahiye, na tere siva chahiye.",
      "Har safar mein mujhe tu hi rahnuma chahiye,",
      "Jeene ko bas mujhe tu hi meherbaan chahiye.",
    ],
    lyric: "Koi aur dooja kyun mujhe chahiye…",
    song: "Tu Chahiye",
  },
  {
    date: "A PRAYER I KEEP",
    salutation: "There's something I quietly wish for,",
    paragraphs: [
      "You know, I always pray to God for just one thing: that someday you will be mine.",
      "I don't know what the future holds, but I really wish I get to spend my life with you.",
      "Har dua mein tujhko main maangu sada,",
      "Rab se hai har ghadi bas yahi iltija.",
    ],
    lyric: "Har dua mein tujhko main maangu sada…",
    song: "Saudebazi (Encore)",
  },
  {
    date: "NO ONE LIKE YOU",
    salutation: "And honestly,",
    paragraphs: [
      "No matter how many people I meet or how many places I go, I don't think I'll ever find someone like you.",
      "Jag Ghoomeya, thaare jaisa na koi. ❤️",
    ],
    lyric: "Jag Ghoomeya, thaare jaisa na koi. ❤️",
    song: "Jag Ghoomeya",
  },
  {
    date: "A PROMISE TO REMEMBER",
    salutation: "Even if someday,",
    paragraphs: [
      "Even if someday you forget me, I don't think I'll ever be able to forget you.",
      "Main kabhi bhooloonga na tujhe, chahe tu mujhko dena bhula,",
      "Aadatein jaisi hai tu meri, aadatein kaise bhooloon bhala?",
    ],
    lyric: "Aadatein jaisi hai tu meri…",
    song: "Kinna Sona",
  },
  {
    date: "IF DESTINY DECIDES",
    salutation: "And if destiny still keeps us apart,",
    paragraphs: [
      "Even after bringing us together…",
      "Mil ke bhi hum na mile, tumse na jaane kyun,",
      "Milon ke hain faasle, tumse na jaane kyun.",
    ],
    lyric: "Mil ke bhi hum na mile…",
    song: "Tu Jaane Na",
  },
  {
    date: "ONE LAST THING",
    salutation: "I don't know what tomorrow holds,",
    paragraphs: [
      "I don't know what will happen tomorrow, but if I ever get to choose, I'll choose you.",
      "Every single time. ❤️",
    ],
    lyric: "I'll choose you. Every single time. ❤️",
    song: "All five songs, for you",
  },
];

const songs = [
  { title: "Tu Chahiye", film: "Bajrangi Bhaijaan · Atif Aslam", video: "VmjynPkyLRQ", source: "YouTube" },
  { title: "Kinna Sona", film: "Bhaag Johnny · Sunil Kamath", video: "XrjwsY-BFck", source: "T-Series" },
  { title: "Jag Ghoomeya", film: "Sultan · Rahat Fateh Ali Khan", video: "t10sQb0Zmjs", source: "YRF" },
  { title: "Saudebazi (Encore)", film: "Aakrosh · Javed Ali", video: "W4sHmzMCo8s", source: "YouTube" },
  { title: "Tu Jaane Na", film: "Ajab Prem Ki Ghazab Kahani · Atif Aslam", video: "", source: "Tips Official search" },
];

export default function OnlyYouLetter() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(false);
  const reduced = useReducedMotion();
  const current = pages[page];
  const activeSong = songs[songIndex];

  const transition = reduced ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };
  const progress = useMemo(() => `${((page + 1) / pages.length) * 100}%`, [page]);

  function chooseSong(index: number) {
    setSongIndex(index);
    setPlayerVisible(true);
  }

  return (
    <main className="letter4u">
      <div className="l4u-scene" aria-hidden="true" />
      <div className="l4u-vignette" aria-hidden="true" />
      <div className="l4u-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${(i % 7) * -.8}s` }} />)}
      </div>
      <motion.div className="l4u-petal l4u-petal-a" aria-hidden="true" animate={reduced ? {} : { y: [0, -18, 0], rotate: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity }} >✿</motion.div>
      <motion.div className="l4u-petal l4u-petal-b" aria-hidden="true" animate={reduced ? {} : { y: [0, 15, 0], rotate: [0, -18, 0] }} transition={{ duration: 9, repeat: Infinity }}>✿</motion.div>

      <header className="l4u-header">
        <a href="/only-you" className="l4u-brand"><Heart size={15} fill="currentColor" /> a letter for you</a>
        <span>MADE WITH CARE · 2026</span>
      </header>

      {!opened ? (
        <section className="l4u-intro">
          <motion.div className="l4u-envelope" initial={reduced ? false : { opacity: 0, y: 35, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .9 }}>
            <span className="l4u-stamp">♡</span>
            <span className="l4u-envelope-small">A NOTE FOR SOMEONE SPECIAL</span>
            <h1>Some words<br />from my <em>heart.</em></h1>
            <p>I've kept these thoughts with me for a while.<br />Today, I wanted you to read them.</p>
            <button className="l4u-button" onClick={() => setOpened(true)}>Open my letter <ArrowRight size={16} /></button>
            <span className="l4u-envelope-script">just for you</span>
          </motion.div>
          <span className="l4u-scene-caption">A LITTLE MOMENT, JUST FOR YOU</span>
        </section>
      ) : (
        <section className="l4u-letter-stage">
          <div className="l4u-stage-label"><Sparkles size={13} /> TAKE YOUR TIME WITH THIS</div>
          <div className="l4u-letter-wrap">
            <AnimatePresence mode="wait">
              <motion.article key={page} className="l4u-paper" initial={reduced ? false : { opacity: 0, y: 24, rotate: page % 2 ? 1 : -1, scale: .98 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: -14, scale: .99 }} transition={transition}>
                <div className="l4u-paper-top"><span>{current.date}</span><span>{String(page + 1).padStart(2, "0")} / 06</span></div>
                <div className="l4u-paper-rule" />
                <h2>{current.salutation}</h2>
                <div className="l4u-paragraphs">
                  {current.paragraphs.map((paragraph, i) => (
                    <motion.p key={`${page}-${i}`} initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .16 + i * .13, duration: .45 }}>{paragraph}</motion.p>
                  ))}
                </div>
                <div className="l4u-lyric-ornament">
                  <span>♪</span><em>{current.lyric}</em><span>♪</span>
                </div>
                <div className="l4u-paper-signoff"><span>With love,</span><strong>Me ♡</strong></div>
                <div className="l4u-paper-flower" aria-hidden="true">✿</div>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="l4u-controls">
            <div className="l4u-progress"><span style={{ width: progress }} /></div>
            <div className="l4u-control-row">
              <button className="l4u-text-button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}><ArrowLeft size={15} /> Back</button>
              <span className="l4u-counter">{String(page + 1).padStart(2, "0")} <i>—</i> 06</span>
              {page < pages.length - 1 ? <button className="l4u-button l4u-next" onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}>Next page <ArrowRight size={15} /></button> : <button className="l4u-button l4u-next" onClick={() => document.getElementById("our-songs")?.scrollIntoView({ behavior: "smooth" })}>Our songs <Music2 size={15} /></button>}
            </div>
          </div>
        </section>
      )}

      <section className="l4u-music" id="our-songs">
        <div className="l4u-music-heading">
          <span className="l4u-section-kicker"><Music2 size={14} /> THE SOUNDTRACK</span>
          <h2>Five songs.<br /><em>One feeling.</em></h2>
          <p>These songs hold little pieces of what I wanted to say.</p>
        </div>
        <div className="l4u-song-area">
          <div className="l4u-song-list">
            {songs.map((song, index) => (
              <button key={song.title} className={`l4u-song-row ${songIndex === index ? "selected" : ""}`} onClick={() => chooseSong(index)}>
                <span className="l4u-song-number">0{index + 1}</span>
                <span className="l4u-song-meta"><strong>{song.title}</strong><small>{song.film}</small></span>
                <span className="l4u-song-play">{songIndex === index && playerVisible ? <Pause size={15} /> : <Play size={15} />}</span>
              </button>
            ))}
          </div>
          <div className="l4u-player-card">
            <div className="l4u-record"><div className="l4u-record-center">♡</div></div>
            <span className="l4u-player-label">NOW PLAYING</span>
            <h3>{activeSong.title}</h3>
            <p>{activeSong.film}</p>
            {playerVisible && activeSong.video ? (
              <div className="l4u-embed"><iframe title={`${activeSong.title} official music video`} src={`https://www.youtube-nocookie.com/embed/${activeSong.video}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
            ) : (
              <div className="l4u-player-placeholder">
                <p>{playerVisible ? "Open the official song search to play this track." : "Choose a song to start listening."}</p>
                {playerVisible && <a className="l4u-external" href="https://www.youtube.com/results?search_query=Tu+Jaane+Na+Atif+Aslam+Tips+Official" target="_blank" rel="noreferrer">Find Tu Jaane Na on YouTube <ArrowRight size={14} /></a>}
              </div>
            )}
            <span className="l4u-player-foot">Playback is provided by YouTube's official/label uploads.</span>
          </div>
        </div>
        <p className="l4u-lyric-note">Your quoted lyric lines appear inside the letter. Full commercial song lyrics and audio remain with their respective rights holders.</p>
      </section>

      <footer className="l4u-footer">
        <span>✿</span>
        <p>And if I ever get to choose…</p>
        <h2>I'll choose <em>you.</em></h2>
        <strong>Every single time. ❤️</strong>
        <small>THE END · BUT NOT THE FEELING</small>
      </footer>
    </main>
  );
}
