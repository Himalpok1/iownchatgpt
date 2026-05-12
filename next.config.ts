import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const gameRedirects = [
  "2048",
  "snake",
  "pong",
  "breakout",
  "tetris",
  "flappybird",
  "tictactoe",
  "memory-match",
  "rock-paper-scissors",
  "whack-a-mole",
  "simon-memory",
  "minesweeper",
  "sudoku",
  "space-shooter",
  "connect-four",
  "word-guess",
  "viralimpostertiktokgame",
  "impostergamenepali",
];

const blogRedirects = [
  "ai-agents-for-small-business-2026",
  "ai-pc-buying-guide-2026",
  "ai-search-and-seo-in-2026",
  "ai-video-generation-workflows-2026",
  "best-open-source-ai-models-2026",
  "bitcoin-etf-trends-2026",
  "cloud-cost-optimization-for-ai-workloads-2026",
  "crypto-risk-management-for-beginners-2026",
  "edge-computing-for-ai-apps-2026",
  "ethereum-layer2-rollups-2026",
  "foldable-phone-buying-guide-2026",
  "matter-smart-home-upgrade-guide-2026",
  "on-device-ai-explained-2026",
  "passkeys-adoption-guide-2026",
  "practical-quantum-computing-progress-2026",
  "smart-glasses-trends-2026",
  "stablecoins-for-global-payments-2026",
  "tokenized-real-world-assets-rwa-2026",
  "wearable-health-tech-trends-2026",
  "zero-trust-security-for-modern-teams-2026",
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      // Legacy game URLs -> new game pages
      ...gameRedirects.map((slug) => ({
        source: `/${slug}`,
        destination: `/games/${slug}`,
        permanent: true,
      })),
      ...gameRedirects.map((slug) => ({
        source: `/${slug}/index.html`,
        destination: `/games/${slug}`,
        permanent: true,
      })),
      // Legacy HTML pages -> new pages
      { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/disclaimer.html", destination: "/disclaimer", permanent: true },
      { source: "/editorial-policy.html", destination: "/editorial-policy", permanent: true },
      { source: "/guides.html", destination: "/guides", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      // Legacy blog URLs
      { source: "/blog/index.html", destination: "/blog", permanent: true },
      // Legacy individual blog post .html URLs -> new clean URLs
      ...blogRedirects.map((slug) => ({
        source: `/blog/${slug}.html`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
