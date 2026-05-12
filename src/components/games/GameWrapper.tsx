"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Game } from "@/lib/games";

interface ScoreResult {
  rank: number;
  score: number;
}

interface GameWrapperProps {
  game: Game;
  userId?: string;
}

export function GameWrapper({ game, userId }: GameWrapperProps) {
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [showSignInNudge, setShowSignInNudge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scoreHandledRef = useRef(false);

  useEffect(() => {
    scoreHandledRef.current = false;

    const handleMessage = async (event: MessageEvent) => {
      if (
        event.data?.type !== "GAME_OVER" ||
        typeof event.data?.score !== "number" ||
        scoreHandledRef.current
      ) {
        return;
      }
      scoreHandledRef.current = true;

      const finalScore: number = event.data.score;

      if (!userId) {
        setShowSignInNudge(true);
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameSlug: game.slug, score: finalScore }),
        });
        if (res.ok) {
          const data = await res.json();
          setScoreResult({ rank: data.rank, score: finalScore });
        }
      } catch {
        // Best-effort — silently fail
      } finally {
        setSubmitting(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game.slug, userId]);

  const dismissBanner = () => {
    setScoreResult(null);
    setShowSignInNudge(false);
    scoreHandledRef.current = false;
  };

  return (
    <div className="w-full max-w-[860px] mx-auto">
      {/* Score saved banner */}
      {scoreResult && (
        <div
          className="card-glass mb-4 px-5 py-3 flex items-center justify-between gap-4"
          style={{ borderColor: "rgba(14,165,233,0.4)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-white font-semibold text-sm">
                Score saved — {scoreResult.score.toLocaleString()} pts
              </p>
              <p className="text-[var(--color-gray-300)] text-xs">
                Your rank:{" "}
                <span
                  className="gradient-text font-bold"
                  style={{ fontSize: "inherit" }}
                >
                  #{scoreResult.rank}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/games/${game.slug}/leaderboard`}
              className="text-[var(--color-cyan)] text-sm hover:opacity-80 transition-opacity"
            >
              View leaderboard →
            </Link>
            <button
              onClick={dismissBanner}
              className="text-[var(--color-gray-400)] hover:text-white transition-colors text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Sign-in nudge */}
      {showSignInNudge && (
        <div
          className="card-glass mb-4 px-5 py-3 flex items-center justify-between gap-4"
          style={{ borderColor: "rgba(249,115,22,0.4)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <p className="text-[var(--color-gray-300)] text-sm">
              <Link href="/auth/login" className="text-[var(--color-cyan)] font-semibold">
                Sign in
              </Link>{" "}
              to save your score and appear on the leaderboard.
            </p>
          </div>
          <button
            onClick={dismissBanner}
            className="text-[var(--color-gray-400)] hover:text-white transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Submitting indicator */}
      {submitting && (
        <div className="card-glass mb-4 px-5 py-3 text-center text-[var(--color-gray-300)] text-sm animate-pulse">
          Saving score…
        </div>
      )}

      {/* Game iframe */}
      <div
        className="card-glass overflow-hidden"
        style={{ padding: 0, aspectRatio: "4/3" }}
      >
        <iframe
          src={`/legacy/${game.legacyPath}`}
          title={`Play ${game.title}`}
          className="w-full h-full border-0"
          allow="autoplay"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
