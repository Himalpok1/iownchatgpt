import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for iownchatgpt.com.",
  alternates: { canonical: "https://iownchatgpt.com/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Disclaimer</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section" style={{ fontWeight: "var(--font-weight-bold)" }}>
            Disclaimer
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Last updated: February 18, 2026
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>1. General Information</h2>
              <p>The content on iownchatgpt.com is provided for general informational and entertainment purposes. We aim for accuracy and usability, but we do not guarantee that all information is complete, current, or error-free at all times.</p>
            </div>
            <div className="content-block">
              <h2>2. Gameplay and Guide Content</h2>
              <p>Strategy tips and guides describe expected behavior based on available game versions at the time of publication. Individual outcomes vary by player skill, device performance, and play style.</p>
            </div>
            <div className="content-block">
              <h2>3. External Services and Links</h2>
              <p>Some pages may include links to third-party services (for example form processing tools). We are not responsible for third-party content, security, or privacy practices.</p>
            </div>
            <div className="content-block">
              <h2>4. Availability and Technical Issues</h2>
              <p>We do not warrant uninterrupted site availability. Maintenance windows, browser compatibility differences, or provider outages may affect access.</p>
            </div>
            <div className="content-block">
              <h2>5. Ads and Monetization</h2>
              <p>If ads are displayed, they are intended to support site maintenance. Ads do not constitute endorsements of products or services unless explicitly stated.</p>
            </div>
            <div className="content-block">
              <h2>6. Limitation of Responsibility</h2>
              <p>By using this site, you agree that iownchatgpt.com is not responsible for losses or damages resulting from reliance on content, inability to access services, or interactions with third-party providers.</p>
            </div>
            <div className="content-block">
              <h2>7. Contact</h2>
              <p>For clarification about this disclaimer, contact <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
