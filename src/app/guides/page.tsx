import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Game Guides",
  description: "Practical game guides for every game on iownchatgpt.com. Strategies, tips, and hosting advice.",
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
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section" style={{ fontWeight: "var(--font-weight-bold)" }}>
            Game Guides
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Last updated: February 18, 2026
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>How to Use This Guide Hub</h2>
              <p>This page exists to provide practical, readable guidance that helps players improve and enjoy each game mode. We keep these notes specific to our own game versions, including controls, match flow, and mobile behavior.</p>
              <p>If you are new, start with the quick setup steps and basic strategy. If you already play regularly, jump to the advanced tips and common mistakes sections for each game.</p>
            </div>

            {/* Flappy Bird Guide */}
            <div className="content-block">
              <h2>Flappy Bird Guide: Building Consistency Instead of Chasing Lucky Runs</h2>

              <h3>Quick Setup</h3>
              <ul>
                <li>Use a stable grip and keep your thumb in one position on mobile.</li>
                <li>Play with minimal distractions; rhythm matters more than reaction spikes.</li>
                <li>Commit to one control method per run: tap or spacebar.</li>
              </ul>

              <h3>Core Strategy</h3>
              <p>Most new players over-correct. The better approach is smaller, early taps that maintain a narrow flight band around the center of each pipe gap. Think of every pipe as the same timing task, not a new panic situation. Your score grows when your motion pattern stays predictable.</p>

              <h3>Common Mistakes</h3>
              <ul>
                <li>Tapping too hard after a low dip, which causes a ceiling crash.</li>
                <li>Watching the bird only; scan one pipe ahead to prepare timing.</li>
                <li>Changing tempo after one good pass instead of keeping rhythm.</li>
              </ul>

              <h3>Practice Drill</h3>
              <p>Do three short rounds where your only target is surviving the first five pipes with smooth movement. Ignore score. This trains control first, then points naturally follow.</p>

              <Link href="/games/flappybird" className="btn-gradient mt-4 inline-block">Play Flappy Bird</Link>
            </div>

            {/* Tic-Tac-Toe Guide */}
            <div className="content-block">
              <h2>Tic-Tac-Toe Guide: Win Through Structure, Not Guessing</h2>

              <h3>Opening Rules</h3>
              <ul>
                <li>If you move first, take the center to maximize options.</li>
                <li>If center is taken, choose a corner rather than an edge.</li>
                <li>Always check for immediate threats before creating your own.</li>
              </ul>

              <h3>Fork Creation</h3>
              <p>A fork means creating two winning threats at once. In our version, players often miss fork defense because they focus only on the most visible line. After every move, ask: &ldquo;Can my opponent make two threats on the next turn?&rdquo; That one question removes most avoidable losses.</p>

              <h3>Defensive Priority Order</h3>
              <ul>
                <li>Block immediate loss.</li>
                <li>Stop opponent fork.</li>
                <li>Create your own fork.</li>
                <li>Take strategic corner.</li>
              </ul>

              <h3>Two-Player Match Etiquette</h3>
              <p>When using the shared-screen mode, agree on player names clearly and reset between rounds when switching seats. This keeps leaderboard stats meaningful and prevents accidental move confusion.</p>

              <Link href="/games/tictactoe" className="btn-gradient mt-4 inline-block">Play Tic-Tac-Toe</Link>
            </div>

            {/* Imposter Party Guide */}
            <div className="content-block">
              <h2>Imposter Party Guide: Running Better Group Sessions</h2>

              <h3>Before the Round</h3>
              <ul>
                <li>Choose category and difficulty based on group age and language comfort.</li>
                <li>Read rules out loud once, especially voting and win conditions.</li>
                <li>Use one device handoff order so word reveals stay private.</li>
              </ul>

              <h3>Discussion Phase Tips</h3>
              <p>Strong rounds come from balanced clues. Encourage players to describe related context instead of exact words. For example, discuss where you use an object, what season it appears in, or what emotion it causes. This gives regular players enough signal while still giving imposters room to bluff.</p>

              <h3>Host Checklist</h3>
              <ul>
                <li>Set a time limit for each discussion round.</li>
                <li>Prevent direct word reveals during clue phase.</li>
                <li>Record quick feedback after each match to adjust difficulty.</li>
              </ul>

              <h3>In the Dark Mode Guidance</h3>
              <p>In this mode, players do not know their role immediately. Keep clues neutral at first, then increase detail gradually. This creates better deduction quality and avoids random voting.</p>

              <div className="flex gap-4 mt-4 flex-wrap">
                <Link href="/games/viralimpostertiktokgame" className="btn-gradient inline-block">Play Imposter Game</Link>
                <Link href="/games/impostergamenepali" className="btn-gradient inline-block">Play Nepali Version</Link>
              </div>
            </div>

            {/* Content Maintenance */}
            <div className="content-block">
              <h2>Content Maintenance and Accuracy</h2>
              <p>These guides are manually updated after gameplay checks, UX changes, or user feedback patterns. We avoid generic advice that could apply to any random clone. If a tip no longer matches behavior in the live game, we correct it in the next update cycle.</p>
              <p>To report an issue, email <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a> with the game name, steps to reproduce, and what you expected to happen.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
