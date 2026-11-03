import type { Metadata } from "next";
import Link from "next/link";
import "./sajda.css";

export const metadata: Metadata = {
  title: "Sajda, for you",
  description: "A quiet little moment, made for you and one song.",
  robots: { index: false, follow: false },
};

export default function SajdaPage() {
  return (
    <main className="sajda-page">
      <header className="sajda-header">
        <Link className="sajda-wordmark" href="/" aria-label="Back to the home page">
          <span aria-hidden="true">♡</span> just for you
        </Link>
        <Link className="sajda-back-link" href="/only-you">A little more to read <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="sajda-hero" aria-labelledby="sajda-title">
        <div className="sajda-orbit sajda-orbit-one" aria-hidden="true" />
        <div className="sajda-orbit sajda-orbit-two" aria-hidden="true" />
        <div className="sajda-orbit sajda-orbit-three" aria-hidden="true" />
        <div className="sajda-copy">
          <span className="sajda-eyebrow"><span aria-hidden="true">✳</span> a small note, with all my heart</span>
          <h1 id="sajda-title">Some feelings<br />sound like <em>you.</em></h1>
          <p className="sajda-message">
            Some feelings are too big to explain. They find their way into a song,
            and somehow, every time, they find their way back to you.
          </p>
          <p className="sajda-signoff">This one always makes me think of you. <span aria-hidden="true">♡</span></p>
        </div>
        <div className="sajda-song" aria-label="Listen to Sajdaa on Spotify">
          <div className="sajda-song-heading">
            <span className="sajda-song-kicker">THE SONG I CHOSE FOR YOU</span>
            <span className="sajda-song-title">Sajdaa</span>
            <span className="sajda-song-subtitle">A little space to listen and stay awhile.</span>
          </div>
          <iframe
            className="sajda-spotify"
            title="Listen to Sajdaa on Spotify"
            src="https://open.spotify.com/embed/track/395gJWcJQK0C3GJfHAn7f6?utm_source=generator&theme=0"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <a className="sajda-open-spotify" href="https://open.spotify.com/track/395gJWcJQK0C3GJfHAn7f6" target="_blank" rel="noreferrer">
            Open in Spotify <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span className="sajda-bottom-note" aria-hidden="true">no pictures · just a feeling</span>
      </section>
    </main>
  );
}
