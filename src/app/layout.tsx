import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "iownchatgpt - Free Browser Games and Trending Tech Blog",
    template: "%s | iownchatgpt",
  },
  description:
    "Play free browser games and read SEO friendly blog content on trending AI, tech, crypto, and consumer electronics topics.",
  keywords: [
    "arcade games",
    "free games",
    "online games",
    "browser games",
    "AI blog 2026",
    "tech trends 2026",
    "crypto trends 2026",
    "consumer electronics trends 2026",
  ],
  authors: [{ name: "Himal Pokhrel" }],
  creator: "iownchatgpt",
  metadataBase: new URL("https://iownchatgpt.com"),
  openGraph: {
    type: "website",
    siteName: "iownchatgpt",
    title: "iownchatgpt - Free Browser Games and Trending Tech Blog",
    description:
      "Play free browser games and read trend focused articles on AI, tech, crypto, and consumer electronics.",
    url: "https://iownchatgpt.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "iownchatgpt - Free Browser Games and Trending Tech Blog",
    description:
      "Play free browser games and read trend focused articles on AI, tech, crypto, and consumer electronics.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "iownchatgpt",
    url: "https://iownchatgpt.com",
    logo: "https://iownchatgpt.com/logo.png",
    description:
      "Free browser games with original gameplay guides and transparent publishing policies.",
    email: "mailme@himal.info.np",
    founder: { "@type": "Person", name: "Himal Pokhrel" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "mailme@himal.info.np",
      url: "https://iownchatgpt.com/contact",
    },
    publishingPrinciples: "https://iownchatgpt.com/editorial-policy",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iownchatgpt",
    url: "https://iownchatgpt.com/",
    description:
      "Free browser games and trending blog coverage across AI, tech, crypto, and consumer electronics.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>

        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-00RR0835VF"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-00RR0835VF');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9781380082063087"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
