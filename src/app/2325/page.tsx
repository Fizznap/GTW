import type { Metadata } from "next";
import Link from "next/link";
import "./2325.css";

export const metadata: Metadata = {
  title: "2325, a little thing that's ours",
  description: "Two birthdays, joined into one little number: 23 and 25.",
  robots: { index: false, follow: false },
};

export default function BirthdayNumberPage() {
  return (
    <main className="number-page">
      <header className="number-header">
        <Link className="number-wordmark" href="/" aria-label="Back to the home page">
          <span aria-hidden="true">♡</span> just for you
        </Link>
        <Link className="number-back" href="/sajda">Back to our song <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="number-main" aria-labelledby="number-title">
        <div className="number-orb number-orb-one" aria-hidden="true" />
        <div className="number-orb number-orb-two" aria-hidden="true" />
        <div className="number-eyebrow"><span aria-hidden="true">✳</span> two days that mean a little more</div>
        <h1 id="number-title">A number<br />only <em>we</em> know.</h1>

        <div className="number-story" aria-label="The meaning of 2325">
          <div className="number-date-card">
            <span className="number-label">MY DAY</span>
            <span className="number-digit">23</span>
            <span className="number-caption">the day I was born</span>
          </div>
          <span className="number-join" aria-hidden="true">·</span>
          <div className="number-date-card">
            <span className="number-label">YOUR DAY</span>
            <span className="number-digit">25</span>
            <span className="number-caption">the day you were born</span>
          </div>
        </div>

        <div className="number-result" aria-label="Twenty-three, twenty-five: 2325">
          <span>put them together</span>
          <strong>23<span>25</span></strong>
        </div>

        <p className="number-message">
          23 is my birthday. 25 is yours. Put them side by side and four little digits
          become a tiny thing that feels like it belongs to both of us.
        </p>
        <p className="number-signoff">A little reminder of you and me. <span aria-hidden="true">♡</span></p>
        <Link className="number-cta" href="/only-you">Read your letters <span aria-hidden="true">→</span></Link>
        <span className="number-footnote" aria-hidden="true">no pictures · just our little number</span>
      </section>
    </main>
  );
}
