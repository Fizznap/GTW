"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiCanvas } from "./ConfettiCanvas";

type AnswerType = "yes" | "no" | null;

const NO_STAGES = [
  {
    subtext: "Any answer is fine. This is a dare, not a trap.",
    noLabel: "No",
  },
  {
    subtext: "Wait, reconsider. I am a great listener and I know cool dinosaur facts.",
    noLabel: "Are you sure? 🤨",
  },
  {
    subtext: "Think of the perks. 99.9% text response uptime and zero dry replies guaranteed.",
    noLabel: "Think of the memes 📱",
  },
  {
    subtext: "System warning: 'No' requires 2-factor authentication from Dora.",
    noLabel: "Error 404 🤖",
  },
  {
    subtext: "Okay okay, fair enough! Last chance before the audit receipt prints:",
    noLabel: "Final answer: No 🫡",
  },
];

const NTFY_TOPIC =
  process.env.NEXT_PUBLIC_NTFY_TOPIC || "gtw-ketali-dare-alert";

export function SecretFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [noStage, setNoStage] = useState(0);
  const [answer, setAnswer] = useState<AnswerType>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleContinue = () => {
    setStep(2);
  };

  const notifyUserOfYes = async () => {
    try {
      // 1. Send via local Next.js API route
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: "yes" }),
      });
    } catch {
      // Fallback: direct public push to ntfy.sh
      try {
        await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
          method: "POST",
          headers: {
            Title: "Ketali said YES!",
            Priority: "urgent",
            Tags: "tada,heart_eyes,sparkles",
          },
          body: `🚨 DARE ALERT: Ketali clicked YES! Timestamp: ${new Date().toLocaleTimeString()}`,
        });
      } catch (err) {
        console.error("Notification fallback failed", err);
      }
    }
  };

  const handleYes = () => {
    setAnswer("yes");
    setStep(3);
    setShowConfetti(true);
    notifyUserOfYes();
  };

  const handleNo = () => {
    if (noStage < NO_STAGES.length - 1) {
      setNoStage((prev) => prev + 1);
    } else {
      setAnswer("no");
      setStep(3);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-5 sm:p-8 overflow-hidden">
      {/* Confetti canvas for "Yes" reaction */}
      <ConfettiCanvas active={showConfetti} />

      {/* Subtle background glow accent */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-rose-50/60 blur-3xl pointer-events-none -z-10"
      />

      {/* Main card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 sm:p-10 z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-rose-50 text-rose-500 border border-rose-100">
                Dare Protocol
              </span>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-light text-zinc-900 tracking-tight">
                  Dare accepted.
                </h1>
                <p className="text-base sm:text-lg font-light text-zinc-500">
                  You said I wouldn&apos;t. Here we are.
                </p>
              </div>

              <div className="w-full pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full h-12 sm:h-13 rounded-xl font-medium text-base text-white bg-zinc-900 hover:bg-zinc-800 active:bg-black transition-colors duration-150 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-rose-500">
                  Official question (dare-mandated):
                </p>
                <h2 className="text-2xl sm:text-3xl font-light text-zinc-900 tracking-tight leading-snug">
                  Ketali, will you be my girlfriend?
                </h2>
                <motion.p
                  key={`subtext-${noStage}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs sm:text-sm font-light text-zinc-500 min-h-[36px] flex items-center justify-center px-2"
                >
                  {NO_STAGES[noStage].subtext}
                </motion.p>
              </div>

              {/* Two buttons side by side: strictly equal size, equal visual weight, stationary */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full pt-1">
                <button
                  type="button"
                  onClick={handleYes}
                  className="w-full h-12 sm:h-13 rounded-xl font-medium text-base text-zinc-900 bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200/90 hover:border-zinc-300 transition-colors duration-150 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  Yes
                </button>
                <motion.button
                  key={`no-btn-${noStage}`}
                  type="button"
                  onClick={handleNo}
                  animate={noStage > 0 ? { x: [-3, 3, -2, 2, 0] } : {}}
                  transition={{ duration: 0.25 }}
                  className="w-full h-12 sm:h-13 rounded-xl font-medium text-sm sm:text-base text-zinc-900 bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200/90 hover:border-zinc-300 transition-colors duration-150 cursor-pointer flex items-center justify-center shadow-sm px-2 text-center"
                >
                  {NO_STAGES[noStage].noLabel}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - NO */}
          {step === 3 && answer === "no" && (
            <motion.div
              key="step-3-no"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-6 w-full"
            >
              {/* Playful Dare Audit Receipt */}
              <div className="w-full bg-zinc-50/90 rounded-xl border border-zinc-200/80 p-5 font-mono text-left text-xs sm:text-[13px] text-zinc-700 space-y-3 leading-relaxed shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                  <span className="font-semibold tracking-wider text-zinc-900">
                    DARE AUDIT RECEIPT
                  </span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-600 font-medium">
                    CASE #GTW-2026
                  </span>
                </div>

                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Applicant:</span>
                    <span className="text-zinc-900 font-medium">Ketali (Dora)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dare Mandate:</span>
                    <span className="text-emerald-600 font-medium">Completed in Full ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Coercion Detected:</span>
                    <span className="text-zinc-900 font-medium">0.00% (Clean record)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Friendship Status:</span>
                    <span className="text-emerald-600 font-medium">100% Intact 🤝</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Awkwardness Fee:</span>
                    <span className="text-zinc-900 font-medium">₹0.00 (Waived)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Refund on Dare:</span>
                    <span className="text-rose-500 font-medium">Denied 🚫</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-zinc-300 pt-2.5 text-center text-zinc-800 text-[12px] font-sans font-medium">
                  Noted. Dare completed, friendship intact. 🫡
                </div>
              </div>

              <div>
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-700 transition-colors"
                >
                  Back to the get-well page
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - YES */}
          {step === 3 && answer === "yes" && (
            <motion.div
              key="step-3-yes"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-rose-50 text-rose-500 border border-rose-100">
                Official Status: Accepted 🎉
              </span>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-light text-zinc-900 tracking-tight leading-snug">
                  Wait, seriously? Screenshot this before anyone changes their mind.
                </h2>
                <p className="text-xs sm:text-sm font-light text-zinc-400">
                  (Dare fulfilled. Smit has received high-priority telemetry.)
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-700 transition-colors"
                >
                  Back to the get-well page
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
