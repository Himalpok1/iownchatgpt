import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Gamepad2,
  MonitorSmartphone,
  Newspaper,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { games, comingSoonGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "iownchatgpt - Free Browser Games and Trending Tech Blog",
  alternates: { canonical: "https://iownchatgpt.com/" },
};

const faqs = [
  {
    question: "Are these games original to this site?",
    answer:
      "Yes. We publish our own browser game builds and maintain guides specific to those versions.",
  },
  {
    question: "Do I need to download anything to play?",
    answer:
      "No. Everything runs directly in the browser with no install step.",
  },
  {
    question: "Is iownchatgpt completely free?",
    answer:
      "Yes. The current library, guides, leaderboards, and blog are all free to use.",
  },
  {
    question: "Can I suggest a game?",
    answer:
      "Yes. Use the request form and we will log it in the product queue.",
  },
  {
    question: "What devices can I play on?",
    answer:
      "Desktop, tablet, and modern phones all work. Some games feel best on larger screens.",
  },
  {
    question: "What makes the content useful?",
    answer:
      "We focus on practical rules, strategy notes, and honest updates rather than filler articles.",
  },
];

const editorialPillars = [
  {
    title: "AI and tech coverage",
    copy:
      "Implementation-focused explainers on AI agents, security, cloud cost, passkeys, and model workflows.",
    bullets: [
      "AI search and SEO strategy",
      "Agent workflows for small teams",
      "Edge AI and zero-trust playbooks",
    ],
    href: "/blog",
    cta: "Read the blog",
  },
  {
    title: "Game guides that match the actual builds",
    copy:
      "Rules, tactics, and hosting tips written for the versions on this site, not generic clones from somewhere else.",
    bullets: [
      "Snake pacing and route planning",
      "Tic-Tac-Toe fork setups and defense",
      "Party game hosting tips for groups",
    ],
    href: "/guides",
    cta: "Read the guides",
  },
];

const trustNotes = [
  {
    icon: ShieldCheck,
    title: "Editorially maintained",
    copy:
      "Policy pages, support routes, and articles are maintained as part of the product rather than bolted on later.",
  },
  {
    icon: MonitorSmartphone,
    title: "Built for quick sessions",
    copy:
      "Fast access to games, readable guide pages, and layouts that hold together across screen sizes.",
  },
  {
    icon: Clock3,
    title: "Regularly updated",
    copy:
      "Games, scores, and written content are reviewed whenever UX or game behavior changes.",
  },
];

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const featuredGames = games.slice(0, 9);
  const heroGames = games.slice(0, 3);

  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="home-hero">
        <div className="container">
          <div className="home-hero__grid">
            <div>
              <span className="home-kicker">Games, guides, and live scores</span>
              <h1>Browser games without the junk around them.</h1>
              <p className="home-hero__lede">
                Play fast arcade games, check leaderboards, and read guides that
                actually match the versions running on the site.
              </p>
              <div className="home-hero__actions">
                <Link href="/games" className="btn-gradient btn-gradient-lg">
                  <Gamepad2 size={18} />
                  Open the library
                </Link>
                <Link href="/guides" className="btn-secondary">
                  <BookOpenText size={18} />
                  Read the guides
                </Link>
              </div>
              <div className="home-hero__stats">
                <div className="home-stat">
                  <strong>18</strong>
                  <span>playable titles live now</span>
                </div>
                <div className="home-stat">
                  <strong>20</strong>
                  <span>editorial articles published</span>
                </div>
                <div className="home-stat">
                  <strong>Real-time</strong>
                  <span>leaderboards and score saves</span>
                </div>
              </div>
            </div>

            <div className="home-rail">
              <div className="surface-panel p-5">
                <div className="home-rail__header">
                  <div>
                    <p className="home-section__eyebrow !mb-2">Start here</p>
                    <h2 className="home-rail__title">Fast picks for a first visit</h2>
                  </div>
                  <Trophy size={18} className="text-[var(--color-cyan)]" />
                </div>
                <div className="home-rail__cards">
                  {heroGames.map((game) => (
                    <Link
                      key={game.slug}
                      href={`/games/${game.slug}`}
                      className="home-rail-card card-glass"
                    >
                      <span className="home-rail-card__icon">{game.icon}</span>
                      <div>
                        <div className="home-rail-card__title">{game.title}</div>
                        <p className="home-rail-card__copy">{game.description}</p>
                      </div>
                      <ArrowRight size={16} className="mt-1 text-[var(--color-cyan)]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="surface-panel p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="home-section__eyebrow !mb-2">Play</p>
                    <p className="home-rail-card__meta">
                      Arcade, puzzle, and strategy games with direct access from the homepage.
                    </p>
                  </div>
                  <div>
                    <p className="home-section__eyebrow !mb-2">Track</p>
                    <p className="home-rail-card__meta">
                      Signed-in score saves and leaderboard pages for the supported titles.
                    </p>
                  </div>
                  <div>
                    <p className="home-section__eyebrow !mb-2">Learn</p>
                    <p className="home-rail-card__meta">
                      Written guides and trend coverage that stay tied to the live product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section section-dark" id="games">
        <div className="container">
          <div className="home-section__header">
            <div>
              <p className="home-section__eyebrow">Library</p>
              <h2 className="home-section__title">A tighter, quicker game shelf.</h2>
            </div>
            <p className="home-section__copy">
              The library favors short sessions, clear rules, and repeatable play.
              Open a game, jump into the leaderboard, or use the written guide when
              you want more than a score chase.
            </p>
          </div>

          <div className="home-games-grid">
            {featuredGames.map((game) => (
              <Link key={game.slug} href={`/games/${game.slug}`} className="game-card card-glass">
                <div className="game-card__top">
                  <span className="game-card__emoji">{game.icon}</span>
                  <span className="badge">Play now</span>
                </div>
                <div>
                  <h3 className="game-card__title">{game.title}</h3>
                  <p className="game-card__copy">{game.description}</p>
                </div>
                <div className="game-card__footer">
                  <span>Open game</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-darker">
        <div className="container">
          <div className="home-dual-grid">
            <div className="home-stack">
              {editorialPillars.map((pillar) => (
                <div key={pillar.title} className="home-list-card card-glass">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                  <ul>
                    {pillar.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Link href={pillar.href} className="btn-secondary">
                      <Newspaper size={16} />
                      {pillar.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-stack">
              <div className="home-request-panel card-glass">
                <p className="home-section__eyebrow">Roadmap</p>
                <h3>More games are already queued.</h3>
                <p>
                  The next set is being shaped around replay value, mobile usability,
                  and whether the concept is worth revisiting after the novelty wears off.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {comingSoonGames.map((game) => (
                    <div key={game.title} className="surface-panel p-4 text-center">
                      <div className="mb-3 text-2xl">{game.icon}</div>
                      <div className="mb-2 text-sm font-semibold text-white">
                        {game.title}
                      </div>
                      <span className="badge">Coming soon</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="home-request-panel card-glass">
                <p className="home-section__eyebrow">Request a title</p>
                <h3>Put a game into the request queue.</h3>
                <p>
                  Suggestions land in the site inbox so we can track what people
                  actually want next.
                </p>
                <InquiryForm type="game_request" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section section-dark">
        <div className="container">
          <div className="home-section__header">
            <div>
              <p className="home-section__eyebrow">Standards</p>
              <h2 className="home-section__title">Built like a product, not a pile of pages.</h2>
            </div>
            <p className="home-section__copy">
              The goal is a usable game-and-content site: clear navigation, real forms,
              stable layouts, and policy pages that are part of the experience rather
              than filler for search engines.
            </p>
          </div>

          <div className="home-games-grid">
            {trustNotes.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.title} className="home-list-card card-glass">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] bg-[rgba(255,255,255,0.05)] text-[var(--color-cyan)]">
                    <Icon size={18} />
                  </div>
                  <h3>{note.title}</h3>
                  <p>{note.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section section-darker">
        <div className="container">
          <div className="home-section__header">
            <div>
              <p className="home-section__eyebrow">FAQ</p>
              <h2 className="home-section__title">Quick answers before you jump in.</h2>
            </div>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <div key={faq.question} className="faq-card card-glass">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
