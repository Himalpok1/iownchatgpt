import type { Metadata } from "next";
import Link from "next/link";

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
        <div className="container">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Contact Us
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Get in touch with us. We&apos;d love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-32)] max-w-[900px] mx-auto">
            <div className="content-block">
              <h2>Send us a Message</h2>
              <form className="flex flex-col gap-[var(--space-16)]">
                <div>
                  <label className="block text-[var(--color-gray-300)] mb-[var(--space-8)] text-[var(--font-size-lg)]">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-gray-300)] mb-[var(--space-8)] text-[var(--font-size-lg)]">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-gray-300)] mb-[var(--space-8)] text-[var(--font-size-lg)]">
                    Subject *
                  </label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-gray-300)] mb-[var(--space-8)] text-[var(--font-size-lg)]">
                    Message *
                  </label>
                  <textarea
                    placeholder="Tell us more..."
                    className="form-input min-h-[150px] resize-y"
                    rows={6}
                    required
                  />
                </div>
                <button type="submit" className="btn-gradient">
                  Send Message
                </button>
              </form>
            </div>

            <div className="content-block">
              <h2>Contact Information</h2>

              <div className="space-y-6 mt-4">
                <div className="flex gap-4 items-start">
                  <span className="text-[32px]">{"\uD83D\uDCE7"}</span>
                  <div>
                    <h3 className="text-white mb-1">Email</h3>
                    <p>
                      <a
                        href="mailto:mailme@himal.info.np"
                        className="text-[var(--color-cyan)]"
                      >
                        mailme@himal.info.np
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-[32px]">{"\uD83C\uDF10"}</span>
                  <div>
                    <h3 className="text-white mb-1">Website</h3>
                    <p>
                      <a
                        href="https://iownchatgpt.com"
                        className="text-[var(--color-cyan)]"
                      >
                        iownchatgpt.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-[32px]">{"\u23F0"}</span>
                  <div>
                    <h3 className="text-white mb-1">Response Time</h3>
                    <p className="text-[var(--color-gray-300)]">
                      We typically respond within 24-48 hours
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(14, 165, 233, 0.08)", border: "1px solid rgba(14, 165, 233, 0.2)" }}>
                  <h3 className="text-white mb-3">Support Links</h3>
                  <ul className="list-none space-y-2">
                    <li>
                      <Link href="/guides" className="text-[var(--color-cyan)]">
                        Read Game Guides
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-[var(--color-cyan)]">
                        Terms of Use
                      </Link>
                    </li>
                    <li>
                      <Link href="/disclaimer" className="text-[var(--color-cyan)]">
                        Disclaimer
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
