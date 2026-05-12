import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for iownchatgpt.com.",
  alternates: { canonical: "https://iownchatgpt.com/terms" },
};

export default function TermsPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Terms of Use</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section" style={{ fontWeight: "var(--font-weight-bold)" }}>
            Terms of Use
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Effective date: February 18, 2026
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using iownchatgpt.com, you agree to these Terms of Use. If you do not agree, do not use the website.</p>
            </div>
            <div className="content-block">
              <h2>2. Service Description</h2>
              <p>iownchatgpt.com provides free browser-based games and related informational content such as guides and policy pages. Availability, features, and game behavior may change over time.</p>
            </div>
            <div className="content-block">
              <h2>3. Acceptable Use</h2>
              <ul>
                <li>Do not attempt to disrupt site operation or game logic.</li>
                <li>Do not use automated abuse, scraping, or attacks against the service.</li>
                <li>Do not submit unlawful, harmful, or abusive content through forms.</li>
              </ul>
            </div>
            <div className="content-block">
              <h2>4. Intellectual Property</h2>
              <p>Site branding, text content, layout, and custom game implementations are protected by applicable intellectual property laws. You may use the site for personal, non-commercial play unless explicit written permission is provided.</p>
            </div>
            <div className="content-block">
              <h2>5. Third-Party Services</h2>
              <p>We may use third-party services for analytics, form processing, and hosting support. Their terms and privacy practices apply when interacting with those services.</p>
            </div>
            <div className="content-block">
              <h2>6. Disclaimer of Warranties</h2>
              <p>The website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not guarantee uninterrupted operation, error-free performance, or fitness for a specific purpose.</p>
            </div>
            <div className="content-block">
              <h2>7. Limitation of Liability</h2>
              <p>To the maximum extent allowed by law, iownchatgpt.com is not liable for indirect, incidental, or consequential damages resulting from your use of the site.</p>
            </div>
            <div className="content-block">
              <h2>8. Changes to Terms</h2>
              <p>We may update these terms from time to time. Continued use of the site after updates means you accept the revised version.</p>
            </div>
            <div className="content-block">
              <h2>9. Contact</h2>
              <p>For questions about these terms, contact <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
