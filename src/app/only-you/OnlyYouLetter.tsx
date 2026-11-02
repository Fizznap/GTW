 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Sparkles, Clock3 } from "lucide-react";

type LyricCue = { id: string; text: string };
type LetterPage = {
  date: string;
  salutation: string;
  paragraphs: string[];
  songIndex: number;
  cues: LyricCue[];
};

const songs = [
  { title: "Tu Chahiye", artist: "Atif Aslam · Bajrangi Bhaijaan", src: "/audio/tu-chahiye.mp3" },
  { title: "Saudebazi (Encore)", artist: "Javed Ali", src: "/audio/saudebazi-encore.mp3" },
  { title: "Jag Ghoomeya", artist: "Rahat Fateh Ali Khan · Sultan", src: "/audio/jag-ghoomeya.mp3" },
  { title: "Kinna Sona", artist: "Sunil Kamath · Bhaag Johnny", src: "/audio/kinna-sona.mp3" },
  { title: "Tu Jaane Na", artist: "Atif Aslam", src: "/audio/tu-jaane-na.mp3" },
];

const pages: LetterPage[] = [
  {
    date: "A LITTLE CONFESSION",
    salutation: "Dear my favourite person,",
    paragraphs: [
      "If you ever say that the girl who will marry me will be so lucky, I'll tell you one thing…",
      "Koi aur dooja kyun mujhe chahiye, na tere siva chahiye.",
      "Har safar mein mujhe tu hi rahnuma chahiye,",
      "Jeene ko bas mujhe tu hi meherbaan chahiye.",
    ],
    songIndex: 0,
    cues: [
      { id: "tu-1", text: "Koi aur dooja kyun mujhe chahiye, na tere siva chahiye." },
      { id: "tu-2", text: "Har safar mein mujhe tu hi rahnuma chahiye." },
      { id: "tu-3", text: "Jeene ko bas mujhe tu hi meherbaan chahiye." },
    ],
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
    songIndex: 1,
    cues: [
      { id: "sau-1", text: "Har dua mein tujhko main maangu sada." },
      { id: "sau-2", text: "Rab se hai har ghadi bas yahi iltija." },
    ],
  },
  {
    date: "NO ONE LIKE YOU",
    salutation: "And honestly,",
    paragraphs: [
      "No matter how many people I meet or how many places I go, I don't think I'll ever find someone like you.",
      "Jag Ghoomeya, thaare jaisa na koi. ❤️",
    ],
    songIndex: 2,
    cues: [{ id: "jag-1", text: "Jag Ghoomeya, thaare jaisa na koi. ❤️" }],
  },
  {
    date: "A PROMISE TO REMEMBER",
    salutation: "Even if someday,",
    paragraphs: [
      "Even if someday you forget me, I don't think I'll ever be able to forget you.",
      "Main kabhi bhooloonga na tujhe, chahe tu mujhko dena bhula,",
      "Aadatein jaisi hai tu meri, aadatein kaise bhooloon bhala?",
    ],
    songIndex: 3,
    cues: [
      { id: "kinna-1", text: "Main kabhi bhooloonga na tujhe, chahe tu mujhko dena bhula." },
      { id: "kinna-2", text: "Aadatein jaisi hai tu meri, aadatein kaise bhooloon bhala?" },
    ],
  },
  {
    date: "IF DESTINY DECIDES",
    salutation: "And if destiny still keeps us apart,",
    paragraphs: [
      "Even after bringing us together…",
      "Mil ke bhi hum na mile, tumse na jaane kyun,",
      "Milon ke hain faasle, tumse na jaane kyun.",
    ],
    songIndex: 4,
    cues: [
      { id: "tujaane-1", text: "Mil ke bhi hum na mile, tumse na jaane kyun." },
      { id: "tujaane-2", text: "Milon ke hain faasle, tumse na jaane kyun." },
    ],
  },
  {
    date: "ONE LAST THING",
    salutation: "I don't know what tomorrow holds,",
    paragraphs: [
      "I don't know what will happen tomorrow, but if I ever get to choose, I'll choose you.",
      "Every single time. ❤️",
    ],
    songIndex: 4,
    cues: [],
  },
];

const STORAGE_KEY = "only-you-lyric-cues-v1";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function OnlyYouLetter() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cues, setCues] = useState<Record<string, number>>({});
  const [showCalibrator, setShowCalibrator] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduced = useReducedMotion();
  const current = pages[page];
  const activeSong = songs[songIndex];
  const pageSong = songs[current.songIndex];
  const transition = reduced ? { duration: 0 } : { duration: .55, ease: [0.22, 1, .36, 1] as const };
  const progress = useMemo(() => `${((page + 1) / pages.length) * 100}%`, [page]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setCues(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cues)); } catch {}
  }, [cues]);

  function loadSong(index: number, autoplay = false, seekTo = 0) {
    const audio = audioRef.current;
    setSongIndex(index);
    if (!audio) return;
    const nextSrc = songs[index].src;
    if (!audio.src.endsWith(nextSrc)) {
      audio.src = nextSrc;
      audio.load();
    }
    const seekAndPlay = () => {
      audio.currentTime = seekTo;
      setCurrentTime(seekTo);
      if (autoplay) void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      else setPlaying(false);
    };
    if (audio.readyState >= 1) seekAndPlay();
    else audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
  }

  function playCue(cueId: string) {
    const time = cues[cueId];
    if (typeof time !== "number") return;
    loadSong(current.songIndex, true, time);
  }

  function markCue(cueId: string) {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    setCues((old) => ({ ...old, [cueId]: audio.currentTime }));
  }

  function selectPage(nextPage: number) {
    setPage(nextPage);
    const targetSong = pages[nextPage].songIndex;
    if (targetSong !== songIndex) loadSong(targetSong, false, 0);
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src || !audio.src.endsWith(activeSong.src)) loadSong(songIndex, true, currentTime);
      else void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  return (
    <main className="letter4u">
      <div className="l4u-scene" aria-hidden="true" />
      <div className="l4u-vignette" aria-hidden="true" />
      <div className="l4u-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${(i % 7) * -.8}s` }} />)}
      </div>
      <motion.div className="l4u-petal l4u-petal-a" aria-hidden="true" animate={reduced ? {} : { y: [0, -18, 0], rotate: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity }}>✿</motion.div>
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
                  {current.paragraphs.map((paragraph, i) => <motion.p key={`${page}-${i}`} initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .16 + i * .13, duration: .45 }}>{paragraph}</motion.p>)}
                </div>
                {current.cues.length > 0 && (
                  <div className="l4u-inline-cues">
                    {current.cues.map((cue) => (
                      <div className="l4u-inline-cue" key={cue.id}>
                        <span>♪</span><em>{cue.text}</em>
                        <button title={cues[cue.id] === undefined ? "Set timestamp in music panel below" : `Play from ${formatTime(cues[cue.id])}`} onClick={() => playCue(cue.id)} disabled={cues[cue.id] === undefined}><Play size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="l4u-paper-signoff"><span>With love,</span><strong>Me ♡</strong></div>
                <div className="l4u-paper-flower" aria-hidden="true">✿</div>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="l4u-controls">
            <div className="l4u-progress"><span style={{ width: progress }} /></div>
            <div className="l4u-control-row">
              <button className="l4u-text-button" onClick={() => selectPage(Math.max(0, page - 1))} disabled={page === 0}><ArrowLeft size={15} /> Back</button>
              <span className="l4u-counter">{String(page + 1).padStart(2, "0")} <i>—</i> 06</span>
              {page < pages.length - 1 ? <button className="l4u-button l4u-next" onClick={() => selectPage(page + 1)}>Next page <ArrowRight size={15} /></button> : <button className="l4u-button l4u-next" onClick={() => document.getElementById("our-songs")?.scrollIntoView({ behavior: "smooth" })}>Our songs <Music2 size={15} /></button>}
            </div>
          </div>
        </section>
      )}

      <section className="l4u-music" id="our-songs">
        <div className="l4u-music-heading">
          <span className="l4u-section-kicker"><Music2 size={14} /> THE SOUNDTRACK</span>
          <h2>Five songs.<br /><em>One feeling.</em></h2>
          <p>Play the recording, mark each lyric as it begins, then replay any line with one tap.</p>
        </div>
        <div className="l4u-song-area">
          <div className="l4u-song-list">
            {songs.map((song, index) => (
              <button key={song.title} className={`l4u-song-row ${songIndex === index ? "selected" : ""}`} onClick={() => loadSong(index, false, 0)}>
                <span className="l4u-song-number">0{index + 1}</span>
                <span className="l4u-song-meta"><strong>{song.title}</strong><small>{song.artist}</small></span>
                <span className="l4u-song-play">{songIndex === index && playing ? <Pause size={15} /> : <Play size={15} />}</span>
              </button>
            ))}
          </div>
          <div className="l4u-player-card">
            <div className={`l4u-record ${playing ? "is-playing" : ""}`}><div className="l4u-record-center">♡</div></div>
            <span className="l4u-player-label">NOW SELECTED</span>
            <h3>{activeSong.title}</h3>
            <p>{activeSong.artist}</p>
            <audio
              ref={audioRef}
              src={activeSong.src}
              preload="metadata"
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
            <div className="l4u-audio-controls">
              <button className="l4u-round-play" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
              <div className="l4u-timebar">
                <input aria-label="Seek audio" type="range" min="0" max={duration || 1} step=".1" value={Math.min(currentTime, duration || 0)} onChange={(e) => seek(Number(e.target.value))} />
                <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
              </div>
            </div>
            <button className="l4u-calibrate-toggle" onClick={() => setShowCalibrator((v) => !v)}><Clock3 size={14} /> {showCalibrator ? "Hide lyric timestamp setup" : "Set exact lyric timestamps"}</button>
            {showCalibrator && (
              <div className="l4u-calibrator">
                <p>Play the song. When a displayed line begins, tap <strong>Mark this moment</strong>. The time is saved in this browser.</p>
                {pages.filter((p) => p.songIndex === songIndex).flatMap((p) => p.cues).map((cue) => (
                  <div className="l4u-calibration-row" key={cue.id}>
                    <span>{cue.text}</span>
                    <button onClick={() => markCue(cue.id)} disabled={!playing}>Mark this moment</button>
                    <small>{cues[cue.id] === undefined ? "Not set" : formatTime(cues[cue.id])}</small>
                  </div>
                ))}
                <button className="l4u-clear-cues" onClick={() => setCues((old) => {
                  const next = { ...old };
                  pages.filter((p) => p.songIndex === songIndex).flatMap((p) => p.cues).forEach((cue) => delete next[cue.id]);
                  return next;
                })}>Clear timings for this song</button>
              </div>
            )}
            <span className="l4u-player-foot">Your uploaded MP3 files are played locally by this page. Playback begins after you press Play.</span>
          </div>
        </div>
        <p className="l4u-lyric-note">Timestamp setup is stored in this browser. After setting the cues, lyric play buttons on the letter will jump to those exact saved positions.</p>
      </section>

      <footer className="l4u-footer">
        <span>✿</span><p>And if I ever get to choose…</p><h2>I'll choose <em>you.</em></h2><strong>Every single time. ❤️</strong><small>THE END · BUT NOT THE FEELING</small>
      </footer>
    </main>
  );
}
