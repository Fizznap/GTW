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
    ],
    songIndex: 2,
    cues: [
      { id: "jag-1", text: "Na wo akhiyan ruhani kahin" },
      { id: "jag-2", text: "Na wo chehra noorani kahin" },
      { id: "jag-3", text: "Kahin dil wali baatein bhi na" },
      { id: "jag-4", text: "Na wo sajri jawani kahin" },
      { id: "jag-5", text: "Jag ghoomeya thaare jaisa na koi. ❤️" },
    ],
  },
  {
    date: "A PROMISE TO REMEMBER",
    salutation: "Even if someday,",
    paragraphs: [
      "Even if someday you forget me, I don't think I'll ever be able to forget you.",
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

// User-provided start points (seconds) for the first lyric cue of each song.
const DEFAULT_CUE_TIMES: Record<string, number> = {
  "tu-1": 110,       // Tu Chahiye — 01:50
  "sau-1": 244,      // Saudebazi (Encore) — 04:04
  "jag-1": 35,       // Jag Ghoomeya — 00:35
  "kinna-1": 230,    // Kinna Sona — 03:50
  "tujaane-1": 32,   // Tu Jaane Na — 00:32
};

// Each track starts at the first known lyric cue, so choosing any song keeps
// the same intentional, timestamped listening experience.
const SONG_START_TIMES = [110, 244, 35, 230, 32];

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
  const [cues, setCues] = useState<Record<string, number>>({});
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingSeekRef = useRef<{ songIndex: number; time: number; autoplay: boolean } | null>(null);
  const reduced = useReducedMotion();
  const current = pages[page];
  const activeSong = songs[songIndex];
  const pageSong = songs[current.songIndex];
  const pageSongLoaded = loadedSongIndex === current.songIndex;
  const pageSongPlaying = pageSongLoaded && songIndex === current.songIndex && playing;
  const letterTime = pageSongLoaded ? currentTime : 0;
  const letterDuration = pageSongLoaded ? duration : 0;
  const transition = reduced ? { duration: 0 } : { duration: .55, ease: [0.22, 1, .36, 1] as const };
  const progress = useMemo(() => `${((page + 1) / pages.length) * 100}%`, [page]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const saved = stored ? JSON.parse(stored) : {};
      // Explicit timestamps supplied by the user take precedence over older saved values.
      setCues({ ...saved, ...DEFAULT_CUE_TIMES });
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cues)); } catch {}
  }, [cues]);

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

  function loadSong(index: number, autoplay = false, seekTo = 0) {
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

  function markCue(cueId: string) {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    setCues((old) => ({ ...old, [cueId]: audio.currentTime }));
  }

  function selectPage(nextPage: number) {
    setPage(nextPage);
    const targetSong = pages[nextPage].songIndex;
    if (targetSong !== songIndex) loadSong(targetSong, false, SONG_START_TIMES[targetSong]);
  }

  function selectSong(index: number) {
    if (index === songIndex) {
      togglePlayback();
      return;
    }
    loadSong(index, true, SONG_START_TIMES[index]);
  }

  function playPageSong() {
    if (!pageSongLoaded || songIndex !== current.songIndex) {
      loadSong(current.songIndex, true, SONG_START_TIMES[current.songIndex]);
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
      loadSong(songIndex, true, currentTime || SONG_START_TIMES[songIndex]);
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
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${(i % 7) * -.8}s` }} />)}
      </div>
      <motion.div className="l4u-petal l4u-petal-a" aria-hidden="true" animate={reduced ? {} : { y: [0, -18, 0], rotate: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity }}>✿</motion.div>
      <motion.div className="l4u-petal l4u-petal-b" aria-hidden="true" animate={reduced ? {} : { y: [0, 15, 0], rotate: [0, -18, 0] }} transition={{ duration: 9, repeat: Infinity }}>✿</motion.div>
      <div className="l4u-flower-character" aria-hidden="true">
        <div className="l4u-flower-bloom">
          {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--petal": index } as React.CSSProperties} />)}
          <span className="l4u-flower-face"><i /><i /><b /></span>
        </div>
        <span className="l4u-flower-stem"><i /><b /></span>
      </div>

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
                <div className="l4u-letter-player" role="group" aria-label={`Song for this letter: ${pageSong.title}`}>
                  <span className="l4u-letter-player-art" aria-hidden="true"><Music2 size={17} /></span>
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
                    <span>{formatTime(pageSongLoaded ? letterTime : SONG_START_TIMES[current.songIndex])}</span>
                    <span>{formatTime(letterDuration)}</span>
                  </div>
                </div>
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
          <p>Each letter has its own song. Listen from its saved cue, or set an exact lyric timestamp below.</p>
        </div>
        <div className="l4u-song-area">
          <div className="l4u-song-list">
            {songs.map((song, index) => (
              <button key={song.title} className={`l4u-song-row ${songIndex === index ? "selected" : ""} ${songIndex === index && playing ? "is-playing" : ""}`} onClick={() => selectSong(index)} aria-pressed={songIndex === index}>
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
              preload="metadata"
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
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
                setAudioError(`Couldn't load ${activeSong.src}. Check that this MP3 exists in the deployed public/audio folder.`);
              }}
              onCanPlay={() => setAudioError("")}
            />
            {audioError && <p className="l4u-audio-error" role="alert">{audioError}</p>}
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
        <p className="l4u-lyric-note">Timestamp setup is stored in this browser. Each letter player starts at its song’s saved cue.</p>
      </section>

      <footer className="l4u-footer">
        <span>✿</span><p>And if I ever get to choose…</p><h2>I'll choose <em>you.</em></h2><strong>Every single time. ❤️</strong><small>THE END · BUT NOT THE FEELING</small>
      </footer>

    </main>
  );
}
