import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "daily-roundup";
  const slot = searchParams.get("slot") ?? "daily";
  const title = slug
    .split("-")
    .slice(3)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .slice(0, 72);

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#08111f"/>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="56" y="54" width="1088" height="522" rx="24" fill="rgba(13,23,40,0.82)" stroke="rgba(148,163,184,0.22)"/>
  <circle cx="1020" cy="128" r="88" fill="rgba(56,189,248,0.18)"/>
  <circle cx="180" cy="520" r="120" fill="rgba(245,158,11,0.16)"/>
  <text x="96" y="132" fill="#bfe7ff" font-size="26" font-family="Arial, sans-serif" letter-spacing="1.2">IOWNCHATGPT NEWSROOM</text>
  <text x="96" y="214" fill="#ffffff" font-size="58" font-weight="700" font-family="Arial, sans-serif">${escapeXml(
    title || "Daily AI, Tech and Crypto Roundup"
  )}</text>
  <text x="96" y="286" fill="#d5e4f4" font-size="28" font-family="Arial, sans-serif">AI-assisted daily roundup with live source citations and human override controls.</text>
  <rect x="96" y="344" width="250" height="44" rx="22" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.3)"/>
  <text x="122" y="372" fill="#ffffff" font-size="24" font-family="Arial, sans-serif">${escapeXml(slot.toUpperCase())} EDITION</text>
  <text x="96" y="468" fill="#94a3b8" font-size="24" font-family="Arial, sans-serif">AI • Tech • Crypto • Consumer Electronics</text>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#08111f"/>
      <stop offset="1" stop-color="#12233B"/>
    </linearGradient>
  </defs>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
