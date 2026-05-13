import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Gamepad2, TimerReset, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Game Guides",
  description:
    "Practical game guides for every game on iownchatgpt.com. Strategies, tips, and hosting advice.",
  alternates: { canonical: "https://iownchatgpt.com/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Game Guides</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">Strategy Desk</p>
                <h1 className="page-hero__title">Guides tuned to the versions people actually play here.</h1>
              </div>
              <p className="page-hero__copy">
                This guide hub is built around our own game modes, controls, and match flow.
                The goal is to help players improve quickly without burying them in filler.
              </p>
            </div>

            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Updated</p>
                <div className="page-summary-card__value">
                  <TimerReset size={18} className="text-[var(--color-cyan)]" />
                  February 18, 2026
                </div>
                <p className="page-summary-card__copy">
                  Reviewed against the current live game behavior and controls.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Focus</p>
                <div className="page-summary-card__value">
                  <Gamepad2 size={18} className="text-[var(--color-cyan)]" />
                  Practical improvement
                </div>
                <p className="page-summary-card__copy">
                  Setup, repeatable strategy, common mistakes, and quick drills.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Use case</p>
                <div className="page-summary-card__value">
                  <Users size={18} className="text-[var(--color-cyan)]" />
                  Solo play and party hosting
                </div>
                <p className="page-summary-card__copy">
                  Some notes are for personal score runs, others are for smoother group sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="page-two-col">
            <div className="guide-grid">
              <article className="surface-panel guide-card">
                <h2>How to use this guide hub</h2>
                <p>
                  Start with the quick setup and the core strategy section for any game you are
                  learning. If you already know the basics, skip to the practice drill and common
                  mistakes. The point is to make your next round better, not to read a textbook.
                </p>
                <p>
                  We keep these notes specific to our own versions, including controls, pacing,
                  mobile behavior, and multiplayer handoff patterns where relevant.
                </p>
              </article>

              <article className="surface-panel guide-card">
                <h2>Flappy Bird guide: build consistency instead of chasing lucky runs</h2>

                <h3>Quick setup</h3>
                <ul>
                  <li>Use a stable grip and keep your thumb in one position on mobile.</li>
                  <li>Play with minimal distractions; rhythm matters more than reaction spikes.</li>
                  <li>Commit to one control method per run: tap or spacebar.</li>
                </ul>

                <h3>Core strategy</h3>
                <p>
                  Most new players over-correct. The better approach is smaller, early taps that
                  maintain a narrow flight band around the center of each pipe gap. Treat each pipe
                  as the same timing task and your score starts rising as the motion pattern gets
                  quieter.
                </p>

                <h3>Common mistakes</h3>
                <ul>
                  <li>Tapping too hard after a low dip, which turns one save into a ceiling crash.</li>
                  <li>Watching the bird only instead of scanning one pipe ahead.</li>
                  <li>Changing tempo after a good pass instead of protecting your rhythm.</li>
                </ul>

                <h3>Practice drill</h3>
                <p>
                  Do three short rounds where the only goal is surviving the first five pipes
                  smoothly. Ignore score. Control first, points second.
                </p>

                <div className="mt-5">
                  <Link href="/games/flappybird" className="btn-gradient">
                    Play Flappy Bird
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>

              <article className="surface-panel guide-card">
                <h2>Tic-Tac-Toe guide: win through structure, not guessing</h2>

                <h3>Opening rules</h3>
                <ul>
                  <li>If you move first, take the center to maximize options.</li>
                  <li>If center is gone, choose a corner rather than an edge.</li>
                  <li>Always check for immediate threats before building your own.</li>
                </ul>

                <h3>Fork creation</h3>
                <p>
                  A fork creates two winning threats at once. In our version, players often miss
                  fork defense because they stare at only the most obvious line. After every move,
                  ask whether your opponent can create two threats next turn. That single habit
                  removes a lot of avoidable losses.
                </p>

                <h3>Defensive priority order</h3>
                <ul>
                  <li>Block immediate loss.</li>
                  <li>Stop the opponent fork.</li>
                  <li>Create your own fork.</li>
                  <li>Take the strongest remaining corner.</li>
                </ul>

                <h3>Shared-screen etiquette</h3>
                <p>
                  When you are using local two-player mode, agree on names clearly and reset
                  between rounds if players switch seats. Small habits like that keep results and
                  match flow clean.
                </p>

                <div className="mt-5">
                  <Link href="/games/tictactoe" className="btn-gradient">
                    Play Tic-Tac-Toe
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>

              <article className="surface-panel guide-card">
                <h2>Imposter Party guide: host rounds that stay fun after the first reveal</h2>

                <h3>Before the round</h3>
                <ul>
                  <li>Choose category and difficulty around the group&apos;s age and language comfort.</li>
                  <li>Read the rules out loud once, especially the voting and win conditions.</li>
                  <li>Use one device handoff order so word reveals stay private.</li>
                </ul>

                <h3>Discussion phase tips</h3>
                <p>
                  The best rounds come from balanced clues. Encourage players to describe related
                  context instead of saying the answer sideways. Talk about when you use a thing,
                  where you encounter it, or how it feels. That gives enough signal to regular
                  players while still leaving the imposter space to bluff.
                </p>

                <h3>Host checklist</h3>
                <ul>
                  <li>Set a time limit for each discussion round.</li>
                  <li>Stop direct word reveals during clue phase.</li>
                  <li>Adjust difficulty based on how quickly rounds collapse or stall.</li>
                </ul>

                <h3>In the Dark mode guidance</h3>
                <p>
                  In this mode, players do not know their role immediately. Keep clues neutral
                  early and add detail gradually. That produces better deduction and less random
                  voting.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/games/viralimpostertiktokgame" className="btn-gradient">
                    Play Imposter Game
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/games/impostergamenepali" className="btn-secondary">
                    Nepali Version
                  </Link>
                </div>
              </article>
            </div>

            <div className="home-stack">
              <aside className="surface-panel home-list-card">
                <h3>What every good guide here includes</h3>
                <ul>
                  <li>Setup notes that match the live game rather than a generic clone.</li>
                  <li>One core strategy you can apply on the next run.</li>
                  <li>Common mistakes to watch for before they become habits.</li>
                  <li>Clear links back into the game when you are ready to test it.</li>
                </ul>
              </aside>

              <aside className="surface-panel home-list-card">
                <h3>Where to start</h3>
                <p>
                  If you want a fast score game, start with Flappy Bird. If you want a clean
                  two-player logic game, start with Tic-Tac-Toe. If you are hosting a group, jump
                  straight to the Imposter Party notes.
                </p>
                <div className="mt-4">
                  <Link href="/games" className="btn-secondary">
                    Browse all games
                  </Link>
                </div>
              </aside>

              <aside className="surface-panel home-list-card">
                <h3>Need a fix or correction?</h3>
                <p>
                  These guides are reviewed after gameplay checks, UX changes, and user feedback.
                  If a tip no longer matches the live game, send a note and we will fold it into
                  the next update cycle.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-cyan)]">
                  <BookOpenText size={16} />
                  mailme@himal.info.np
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
