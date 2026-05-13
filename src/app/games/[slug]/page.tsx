import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { games } from "@/lib/games";
import { GameWrapper } from "@/components/games/GameWrapper";
import { ChessGame } from "@/components/chess/ChessGame";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  if (!game) return {};

  return {
    title: `Play ${game.title} - Free Browser Game`,
    description: game.description,
    alternates: { canonical: `https://iownchatgpt.com/games/${slug}` },
    openGraph: {
      title: `Play ${game.title} - Free Browser Game`,
      description: game.description,
      url: `https://iownchatgpt.com/games/${slug}`,
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  if (!game) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `https://iownchatgpt.com/games/${slug}`,
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const isChess = game.slug === "chess";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />

      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <Link href="/games">Games</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">{game.title}</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <div className="text-center mb-8">
            <div className="text-[80px] mb-4">{game.icon}</div>
            <h1
              className="text-3xl sm:text-4xl md:text-[48px] mb-[var(--space-16)] gradient-text-section"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              {game.title}
            </h1>
            <p className="text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-8">
              {game.description}
            </p>
          </div>

          {/* Game */}
          {isChess ? (
            <ChessGame />
          ) : (
            <GameWrapper game={game} userId={userId} />
          )}

          {/* Leaderboard + Back links */}
          <div className="flex items-center justify-between mt-8">
            <Link
              href="/games"
              className="text-[var(--color-gray-400)] text-sm hover:text-white transition-colors"
            >
              &larr; All Games
            </Link>
            {!isChess && (
              <Link
                href={`/games/${slug}/leaderboard`}
                className="text-[var(--color-cyan)] text-[var(--font-size-lg)] hover:opacity-80 transition-opacity"
              >
                🏆 Leaderboard &rarr;
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
