import type { Metadata } from "next";
import Link from "next/link";
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
      "No! All games are played directly in your web browser. No downloads or installations required.",
  },
  {
    question: "Is iownchatgpt completely free?",
    answer:
      "Absolutely! All games are 100% free to play with no hidden costs or premium features.",
  },
  {
    question: "Can I suggest a game?",
    answer:
      "Yes! Use our Game Request form to suggest your favorite game idea. We love hearing from our community!",
  },
  {
    question: "What devices can I play on?",
    answer:
      "Our games work on any device with a modern web browser - PC, Mac, tablets, and smartphones.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "Currently, all games are accessible through your web browser. No app needed!",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-[var(--space-24)] overflow-hidden">
        <div className="relative z-2 max-w-[900px]">
          <h1
            className="text-4xl sm:text-5xl md:text-[64px] leading-tight mb-[var(--space-24)] animate-fade-in"
            style={{
              fontWeight: "var(--font-weight-bold)",
              background: "linear-gradient(135deg, #fff4df, #bae6fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            Free Browser Arcade Games With Real Player Guides
          </h1>
          <p className="text-[var(--font-size-2xl)] text-[var(--color-gray-300)] mb-[var(--space-32)] leading-relaxed animate-fade-in-delay-1">
            Play instantly and learn strategies, rules, and hosting tips written
            for each game.
          </p>
          <Link
            href="/games"
            className="btn-gradient btn-gradient-lg animate-fade-in-delay-2"
          >
            Play Now
          </Link>
        </div>

        {/* Background orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              background: "var(--color-purple)",
              top: "10%",
              left: "10%",
              filter: "blur(80px)",
              opacity: 0.3,
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              background: "var(--color-cyan)",
              top: "50%",
              right: "10%",
              filter: "blur(80px)",
              opacity: 0.3,
              animation: "float 6s ease-in-out infinite 2s",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 350,
              height: 350,
              background: "var(--color-purple)",
              bottom: "10%",
              left: "50%",
              filter: "blur(80px)",
              opacity: 0.3,
              animation: "float 6s ease-in-out infinite 4s",
            }}
          />
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="section-dark">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Game Library
          </h2>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Play our growing collection of quick, replayable games built for
            desktop and mobile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-32)] mt-[var(--space-32)]">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="card-glass p-[var(--space-32)] text-center cursor-pointer no-underline transition-transform duration-[var(--duration-normal)]"
              >
                <div className="text-[80px] mb-[var(--space-16)]">
                  {game.icon}
                </div>
                <h3
                  className="text-[var(--font-size-3xl)] text-white mb-[var(--space-12)]"
                  style={{ fontWeight: "var(--font-weight-bold)" }}
                >
                  {game.title}
                </h3>
                <p className="text-[var(--font-size-lg)] text-[var(--color-gray-300)] mb-[var(--space-24)] leading-relaxed">
                  {game.description}
                </p>
                <span className="btn-gradient">Play Now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-darker">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            More Games Coming Soon
          </h2>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Stay tuned for exciting new releases
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-24)] mb-16">
            {comingSoonGames.map((game) => (
              <div
                key={game.title}
                className="card-glass p-[var(--space-32)] text-center border-[rgba(125,211,252,0.14)]"
              >
                <div className="text-[60px] mb-[var(--space-16)] opacity-60">
                  {game.icon}
                </div>
                <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-12)]">
                  {game.title}
                </h3>
                <span className="badge">Coming Soon</span>
              </div>
            ))}
          </div>

          {/* Game Request Form */}
          <div className="card-glass max-w-[600px] mx-auto p-[var(--space-32)] text-center border-[rgba(255,255,255,0.1)]">
            <h3 className="text-[var(--font-size-3xl)] text-white mb-[var(--space-12)]">
              Request Your Next Favorite Game!
            </h3>
            <p className="text-[var(--color-gray-300)] mb-[var(--space-24)]">
              Have a game idea? Tell us what you&apos;d like to see next. We
              prioritize practical, replayable game concepts from community
              feedback.
            </p>
            <form className="flex flex-col gap-[var(--space-12)] mb-[var(--space-16)]">
              <input
                type="text"
                placeholder="Your Name"
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="form-input"
                required
              />
              <textarea
                placeholder="Describe the game you'd like to see (e.g., Snake Game, Tetris, Pong...)"
                className="form-input min-h-[100px] resize-y"
                rows={4}
                required
              />
              <button type="submit" className="btn-gradient">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-dark">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Everything you need to know about iownchatgpt
          </p>

          <div className="max-w-[800px] mx-auto space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="card-glass p-[var(--space-24)]"
              >
                <h3 className="text-[var(--font-size-xl)] text-white mb-[var(--space-8)] font-[var(--font-weight-semibold)]">
                  {faq.question}
                </h3>
                <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-darker">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-32)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Why Choose iownchatgpt?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-24)]">
            {[
              {
                icon: "\uD83E\uDD16",
                title: "Original Game Builds",
                desc: "Custom browser versions maintained and updated on this site",
              },
              {
                icon: "\uD83C\uDF89",
                title: "Free to Play",
                desc: "No subscriptions, no payments required",
              },
              {
                icon: "\u26A1",
                title: "Instant Play",
                desc: "No downloads needed, play directly in your browser",
              },
              {
                icon: "\uD83D\uDCF1",
                title: "Mobile Friendly",
                desc: "Enjoy games on any device, anytime, anywhere",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-glass p-[var(--space-32)] text-center"
              >
                <div className="text-[48px] mb-[var(--space-16)]">
                  {feature.icon}
                </div>
                <h3 className="text-[var(--font-size-xl)] text-white mb-[var(--space-8)] font-[var(--font-weight-semibold)]">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Coverage Section */}
      <section className="section-dark">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Trending Blog Coverage
          </h2>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            New long form articles targeting active search demand in AI, tech,
            crypto, and consumer electronics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-32)]">
            <div className="card-glass p-[var(--space-32)]">
              <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-16)] font-[var(--font-weight-semibold)]">
                AI and Tech Trend Analysis
              </h3>
              <p className="text-[var(--color-gray-300)] mb-[var(--space-16)] leading-relaxed text-[var(--font-size-lg)]">
                Explore implementation focused content on AI agents, open
                models, passkeys, edge computing, and cloud cost optimization.
              </p>
              <ul className="list-none space-y-2 mb-[var(--space-24)]">
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  AI agents for small businesses in 2026
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  AI search and SEO strategy updates
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Passkeys, zero trust, and edge AI playbooks
                </li>
              </ul>
              <Link href="/blog" className="btn-gradient">
                Read The Blog
              </Link>
            </div>

            <div className="card-glass p-[var(--space-32)]">
              <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-16)] font-[var(--font-weight-semibold)]">
                Crypto and Device Buying Guides
              </h3>
              <p className="text-[var(--color-gray-300)] mb-[var(--space-16)] leading-relaxed text-[var(--font-size-lg)]">
                Read educational crypto explainers and practical consumer
                electronics buying guides with clear risk framing.
              </p>
              <ul className="list-none space-y-2 mb-[var(--space-24)]">
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Bitcoin ETF and stablecoin trend explainers
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Layer 2 rollups and RWA tokenization basics
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  AI PC, foldable phone, and smart glasses guides
                </li>
              </ul>
              <Link href="/blog" className="btn-gradient">
                View 20 Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="section-darker">
        <div className="container">
          <h2
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Player Guides and Content Standards
          </h2>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Original non-thin content for players, party hosts, and families.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-32)]">
            <div className="card-glass p-[var(--space-32)]">
              <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-16)] font-[var(--font-weight-semibold)]">
                Detailed Guides for Every Game
              </h3>
              <p className="text-[var(--color-gray-300)] mb-[var(--space-16)] leading-relaxed text-[var(--font-size-lg)]">
                Each game includes practical, written guidance beyond the game
                screen itself. We explain game rules, advanced strategies, and
                common mistakes.
              </p>
              <ul className="list-none space-y-2 mb-[var(--space-24)]">
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Flappy Bird timing drills and score-building strategy
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Tic-Tac-Toe opening patterns, forks, and defense plans
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Imposter game hosting guides for different group sizes
                </li>
              </ul>
              <Link href="/guides" className="btn-gradient">
                Read Full Guides
              </Link>
            </div>

            <div className="card-glass p-[var(--space-32)]">
              <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-16)] font-[var(--font-weight-semibold)]">
                How We Keep Content Useful
              </h3>
              <p className="text-[var(--color-gray-300)] mb-[var(--space-16)] leading-relaxed text-[var(--font-size-lg)]">
                We maintain this site as a practical gaming resource, not just a
                game launcher. Every guide is reviewed for clarity, tested during
                gameplay, and updated when mechanics or UX changes.
              </p>
              <ul className="list-none space-y-2 mb-[var(--space-24)]">
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Clear author/editor accountability
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  No auto-generated filler articles
                </li>
                <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                  Policy pages that explain data use and site rules
                </li>
              </ul>
              <Link href="/editorial-policy" className="btn-gradient">
                Editorial Policy
              </Link>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="card-glass p-[var(--space-32)] mt-[var(--space-32)] border-[rgba(255,255,255,0.1)]">
            <h3 className="text-[var(--font-size-2xl)] text-white mb-[var(--space-16)] font-[var(--font-weight-semibold)]">
              Recent Content Updates
            </h3>
            <ul className="list-none space-y-3">
              <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                <strong>February 18, 2026:</strong> Added long-form game guides,
                terms, disclaimer, and editorial policy pages.
              </li>
              <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                <strong>February 18, 2026:</strong> Improved internal
                navigation, removed placeholder links, and expanded trust and
                support resources.
              </li>
              <li className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] pl-6 relative before:content-['\2022'] before:text-[var(--color-cyan)] before:absolute before:left-2">
                <strong>November 2, 2025:</strong> Published privacy and contact
                pages with form support.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
