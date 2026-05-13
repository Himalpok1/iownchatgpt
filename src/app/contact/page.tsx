import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Globe, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with iownchatgpt. We'd love to hear from you!",
  alternates: { canonical: "https://iownchatgpt.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Contact Us</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">Contact</p>
                <h1 className="page-hero__title">A direct way to reach the people behind the site.</h1>
              </div>
              <p className="page-hero__copy">
                Use the form for support, feedback, partnership notes, or product suggestions. It
                saves directly into the app backend, so it is much better than the old mailto flow.
              </p>
            </div>

            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Best for</p>
                <div className="page-summary-card__value">
                  <MessageSquareText size={18} className="text-[var(--color-cyan)]" />
                  support, feedback, requests
                </div>
                <p className="page-summary-card__copy">
                  Report a problem, ask a question, or suggest a game or feature.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Response time</p>
                <div className="page-summary-card__value">
                  <Clock3 size={18} className="text-[var(--color-cyan)]" />
                  usually within 24 to 48 hours
                </div>
                <p className="page-summary-card__copy">
                  Enough time to respond thoughtfully without leaving requests hanging.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Routing</p>
                <div className="page-summary-card__value">
                  <ShieldCheck size={18} className="text-[var(--color-cyan)]" />
                  stored in the app inbox
                </div>
                <p className="page-summary-card__copy">
                  Messages are captured server-side so they do not get lost in a local mail client.
                </p>
              </div>
            </div>
          </div>

          <div className="page-two-col">
            <div className="surface-panel guide-card">
              <h2>Send a message</h2>
              <p className="mb-5 text-[var(--color-gray-200)]">
                The more specific your note is, the easier it is for us to fix, plan, or follow
                up on quickly.
              </p>
              <InquiryForm type="contact" />
            </div>

            <div className="home-stack">
              <div className="surface-panel home-list-card">
                <h3>Direct contact</h3>
                <div className="grid gap-4 mt-4">
                  <div className="flex gap-4 items-start">
                    <div className="game-card__emoji">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-[var(--font-weight-semibold)] mb-1">Email</h4>
                      <a href="mailto:mailme@himal.info.np" className="text-[var(--color-cyan)]">
                        mailme@himal.info.np
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="game-card__emoji">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-[var(--font-weight-semibold)] mb-1">Website</h4>
                      <a href="https://iownchatgpt.com" className="text-[var(--color-cyan)]">
                        iownchatgpt.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-panel home-list-card">
                <h3>Useful links</h3>
                <ul>
                  <li>
                    <Link href="/guides" className="text-[var(--color-cyan)]">
                      Read the game guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/leaderboards" className="text-[var(--color-cyan)]">
                      Check the live leaderboards
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-[var(--color-cyan)]">
                      Terms of use
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="text-[var(--color-cyan)]">
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="surface-panel home-list-card">
                <h3>What helps us answer faster</h3>
                <ul>
                  <li>Name the game, page, or feature you are talking about.</li>
                  <li>Explain what happened and what you expected to happen instead.</li>
                  <li>Include enough detail that we can reproduce the issue on our side.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
