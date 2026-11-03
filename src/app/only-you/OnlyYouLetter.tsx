 "use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Sparkles } from "lucide-react";

type LetterPage = {
  date: string;
  salutation: string;
  paragraphs: string[];
  lyrics: string[];
  emphasis?: string;
  songIndex: number;
};

const songs = [
  { title: "Tu Chahiye", artist: "Atif Aslam · Bajrangi Bhaijaan", src: "/audio/tu-chahiye.mp3", startTime: 110 },
  { title: "Saudebazi (Encore)", artist: "Javed Ali", src: "/audio/saudebazi-encore.mp3", startTime: 244 },
  { title: "Jag Ghoomeya", artist: "Rahat Fateh Ali Khan · Sultan", src: "/audio/jag-ghoomeya.mp3", startTime: 35 },
  { title: "Kinna Sona", artist: "Sunil Kamath · Bhaag Johnny", src: "/audio/kinna-sona.mp3", startTime: 230 },
  { title: "Tu Jaane Na", artist: "Atif Aslam", src: "/audio/tu-jaane-na.mp3", startTime: 32 },
  { title: "Soniyo", artist: "Sonu Nigam · Shreya Ghoshal · Raju Singh", src: "/audio/soniyo.mp3", startTime: 8 },
];

const pages: LetterPage[] = [
  {
    date: "A LITTLE CONFESSION",
    salutation: "Dear my favourite person,",
    paragraphs: [
      "If you ever say that the girl who will marry me will be so lucky, I'll tell you one thing…",
    ],
    lyrics: [
      "Koi aur dooja kyun mujhe chahiye, na tere siva chahiye.",
      "Har safar mein mujhe tu hi rahnuma chahiye,",
      "Jeene ko bas mujhe tu hi meherbaan chahiye.",
    ],
    songIndex: 0,
  },
  {
    date: "A PRAYER I KEEP",
    salutation: "There's something I quietly wish for,",
    paragraphs: [
      "You know, I always pray to God for just one thing: that someday you will be mine.",
      "I don't know what the future holds, but I really wish I get to spend my life with you.",
    ],
    lyrics: [
      "Main kabhi bhooloonga na tujhe, chahe tu mujhko dena bhula,",
      "Aadatein jaisi hai tu meri, aadatein kaise bhooloon bhala?",
    ],
    songIndex: 3,
  },
  {
    date: "NO ONE LIKE YOU",
    salutation: "And honestly,",
    paragraphs: [
      "No matter how many people I meet or how many places I go, I don't think I'll ever find someone like you.",
    ],
    lyrics: [
      "Na wo akhiyan ruhani kahin,",
      "Na wo chehra noorani kahin,",
      "Kahin dil wali baatein bhi na,",
      "Na wo sajri jawani kahin,",
      "Jag ghoomeya thaare jaisa na koi. ❤️",
    ],
    songIndex: 2,
  },
  {
    date: "A PROMISE TO REMEMBER",
    salutation: "Even if someday,",
    paragraphs: [
      "Even if someday you forget me, I don't think I'll ever be able to forget you.",
    ],
    lyrics: [
      "Har dua mein tujhko main maangu sada,",
      "Rab se hai har ghadi bas yahi iltija.",
    ],
    songIndex: 1,
  },
  {
    date: "IF DESTINY DECIDES",
    salutation: "And if destiny still keeps us apart,",
    paragraphs: [
      "Even after bringing us together…",
    ],
    lyrics: [
      "Mil ke bhi hum na mile, tumse na jaane kyun,",
      "Milon ke hain faasle, tumse na jaane kyun.",
    ],
    songIndex: 4,
  },
  {
    date: "ONE LAST THING",
    salutation: "One last thing,",
    paragraphs: [
      "I don't know where life will take us, or what tomorrow has planned for us. But if I ever get to choose the person I want beside me through every moment, every dream, and every little thing in life, it will always be you.",
    ],
    lyrics: [],
    emphasis: "You are the one I'd choose, in every lifetime. ❤️",
    songIndex: 5,
  },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isCurrentTrack(audio: HTMLAudioElement, index: number) {
  const source = audio.currentSrc || audio.src;
  return source ? new URL(source, window.location.href).pathname.endsWith(songs[index].src) : false;
}

export default function OnlyYouLetter() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [loadedSongIndex, setLoadedSongIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingSeekRef = useRef<{ songIndex: number; time: number; autoplay: boolean } | null>(null);
  const reduced = useReducedMotion();
  const current = pages[page];
  const pageSong = songs[current.songIndex];
  const pageSongLoaded = loadedSongIndex === current.songIndex;
  const pageSongPlaying = pageSongLoaded && songIndex === current.songIndex && playing;
  const letterTime = pageSongLoaded ? currentTime : 0;
  const letterDuration = pageSongLoaded ? duration : 0;
  const transition = reduced ? { duration: 0 } : { duration: .55, ease: [0.22, 1, .36, 1] as const };
  const progress = useMemo(() => `${((page + 1) / pages.length) * 100}%`, [page]);

  function applyPendingSeek(audio: HTMLAudioElement) {
    const pending = pendingSeekRef.current;
    if (!pending || audio.readyState < 1) return;
    if (!isCurrentTrack(audio, pending.songIndex)) return;

    pendingSeekRef.current = null;
    const safeTime = Math.max(0, Math.min(pending.time, Number.isFinite(audio.duration) ? audio.duration : pending.time));
    try {
      audio.currentTime = safeTime;
      setCurrentTime(safeTime);
      setDuration(audio.duration || 0);
    } catch {
      setAudioError("The browser could not seek in this audio file. Try pressing the lyric button again.");
      return;
    }

    if (pending.autoplay) {
      void audio.play()
        .then(() => { setPlaying(true); setAudioError(""); })
        .catch((error) => {
          setPlaying(false);
          setAudioError(error?.message || "Playback was blocked. Tap Play again.");
        });
    } else {
      setPlaying(false);
    }
  }

  function loadSong(index: number, autoplay = false, seekTo = songs[index].startTime) {
    const audio = audioRef.current;
    const target = songs[index];
    setSongIndex(index);
    setLoadedSongIndex(index);
    setAudioError("");
    setCurrentTime(seekTo);
    pendingSeekRef.current = { songIndex: index, time: seekTo, autoplay };

    if (!audio) return;

    const targetPath = target.src;
    const alreadyLoaded = isCurrentTrack(audio, index) && audio.readyState >= 1;

    if (alreadyLoaded) {
      audio.pause();
      applyPendingSeek(audio);
      return;
    }

    setDuration(0);

    // The audio element is intentionally uncontrolled: do not also pass a React `src` prop.
    // This prevents a stale render from swapping a newly selected MP3 back to the previous track.
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.src = targetPath;
    audio.load();
  }

  function selectPage(nextPage: number) {
    setPage(nextPage);
    const targetSong = pages[nextPage].songIndex;
    if (targetSong !== songIndex) loadSong(targetSong, false, songs[targetSong].startTime);
  }

  function playPageSong() {
    if (!pageSongLoaded || songIndex !== current.songIndex) {
      loadSong(current.songIndex, true, pageSong.startTime);
      return;
    }
    togglePlayback();
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!isCurrentTrack(audio, songIndex)) {
      loadSong(songIndex, true, currentTime || songs[songIndex].startTime);
      return;
    }

    if (pendingSeekRef.current) {
      applyPendingSeek(audio);
      return;
    }

    void audio.play()
      .then(() => { setPlaying(true); setAudioError(""); })
      .catch((error) => {
        setPlaying(false);
        setAudioError(error?.message || "Playback was blocked. Tap Play again.");
      });
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
        {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${(i % 5) * -.8}s` }} />)}
      </div>
      <div className="l4u-petal l4u-petal-a" aria-hidden="true">✿</div>
      <div className="l4u-petal l4u-petal-b" aria-hidden="true">✿</div>
      <div className="l4u-flower-character" aria-hidden="true">
        <div className="l4u-flower-bloom">
          {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--petal": index } as React.CSSProperties} />)}
          <span className="l4u-flower-face"><i /><i /><b /></span>
        </div>
        <span className="l4u-flower-stem"><i /><b /></span>
      </div>

      <header className="l4u-header">
        <a href="/only-you" className="l4u-brand"><span className="l4u-brand-sticker" aria-hidden="true">♡</span> a letter for you</a>
        <span>MADE WITH CARE · 2026</span>
      </header>

      {!opened ? (
        <section className="l4u-intro">
          <div className="l4u-memory-card" aria-hidden="true">
            <span className="l4u-memory-pin">♡</span>
            <span className="l4u-memory-image" />
            <span className="l4u-memory-caption">A little piece of our sky</span>
          </div>
          <motion.div className="l4u-envelope" initial={reduced ? false : { opacity: 0, y: 35, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .9 }}>
            <span className="l4u-stamp">♡</span>
            <span className="l4u-envelope-small">A NOTE FOR SOMEONE SPECIAL</span>
            <h1>Some words<br />from my <em>heart.</em></h1>
            <p>I&apos;ve kept these thoughts with me for a while.<br />Today, I wanted you to read them.</p>
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
                <div className="l4u-paper-inner">
                <div className="l4u-paper-top"><span>{current.date}</span><span>{String(page + 1).padStart(2, "0")} / 06</span></div>
                <div className="l4u-paper-rule" />
                <h2>{current.salutation}</h2>
                <div className="l4u-paragraphs">
                  {current.paragraphs.map((paragraph, i) => <motion.p key={`${page}-${i}`} className="l4u-letter-copy" initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .12 + i * .1, duration: .35 }}>{paragraph}</motion.p>)}
                </div>
                {current.lyrics.length > 0 && (
                  <div className="l4u-lyrics" aria-label="Lyrics for this letter">
                    {current.lyrics.map((line, i) => <motion.p key={`${page}-lyric-${i}`} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .18 + i * .07, duration: .3 }}>{line}</motion.p>)}
                  </div>
                )}
                {current.emphasis && <p className="l4u-final-emphasis">{current.emphasis}</p>}
                <div className="l4u-letter-player" role="group" aria-label={`Song for this letter: ${pageSong.title}`}>
                  <span className={`l4u-letter-player-art ${pageSongPlaying ? "is-playing" : ""}`} aria-hidden="true"><Music2 size={17} /></span>
                  <span className="l4u-letter-player-meta">
                    <small>THE SONG FOR THIS LETTER</small>
                    <strong>{pageSong.title}</strong>
                    <span>{pageSong.artist}</span>
                  </span>
                  <button className="l4u-letter-player-button" onClick={playPageSong} aria-label={`${pageSongPlaying ? "Pause" : "Play"} ${pageSong.title}`}>
                    {pageSongPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <div className="l4u-letter-player-timeline">
                    <input aria-label={`Seek ${pageSong.title}`} type="range" min="0" max={letterDuration || 1} step=".1" value={Math.min(letterTime, letterDuration || 0)} onChange={(event) => seek(Number(event.target.value))} disabled={!pageSongLoaded || !letterDuration} />
                    <span>{formatTime(pageSongLoaded ? letterTime : pageSong.startTime)}</span>
                    <span>{formatTime(letterDuration)}</span>
                  </div>
                  {audioError && <p className="l4u-audio-error" role="alert">{audioError}</p>}
                </div>
                <div className="l4u-paper-signoff"><span>With love,</span><strong>Me ♡</strong></div>
                <div className="l4u-paper-flower" aria-hidden="true">✿</div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="l4u-controls">
            <div className="l4u-progress"><span style={{ width: progress }} /></div>
            <div className="l4u-control-row">
              <button className="l4u-text-button" onClick={() => selectPage(Math.max(0, page - 1))} disabled={page === 0}><ArrowLeft size={15} /> Back</button>
              <span className="l4u-counter">{String(page + 1).padStart(2, "0")} <i>—</i> 06</span>
              {page < pages.length - 1 ? <button className="l4u-button l4u-next" onClick={() => selectPage(page + 1)}>Next page <ArrowRight size={15} /></button> : <button className="l4u-button l4u-next" onClick={() => document.getElementById("letter-ending")?.scrollIntoView({ behavior: "smooth" })}>With all my love <Heart size={15} /></button>}
            </div>
          </div>
        </section>
      )}

      <audio
        ref={audioRef}
        className="l4u-audio-source"
        preload="none"
        onTimeUpdate={(event) => setCurrentTime(Math.floor(event.currentTarget.currentTime))}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          applyPendingSeek(event.currentTarget);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onSeeked={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onError={() => {
          setPlaying(false);
          setLoadedSongIndex(null);
          setAudioError(`Couldn't load ${songs[songIndex].title}. Please try again.`);
        }}
        onCanPlay={() => setAudioError("")}
      />

      <footer className="l4u-footer" id="letter-ending">
        <span aria-hidden="true">✿</span><p>Thank you for reading this far.</p><h2>With all my <em>heart.</em></h2><small>MADE FOR YOU · ALWAYS</small>
      </footer>

    </main>
  );
}
