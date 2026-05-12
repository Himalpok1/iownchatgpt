import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(125,211,252,0.1)] mt-auto"
      style={{ backgroundColor: "rgba(7, 14, 30, 0.95)" }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3
              className="text-[var(--font-size-3xl)] font-[var(--font-weight-bold)] mb-4"
              style={{
                background: "linear-gradient(135deg, var(--color-purple), var(--color-cyan))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              iownchatgpt
            </h3>
            <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] leading-relaxed">
              Free browser arcade games with strategy guides and policy transparency.
            </p>
          </div>

          <div>
            <h4 className="text-white text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] mb-4">
              Quick Links
            </h4>
            <ul className="list-none space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "Games" },
                { href: "/blog", label: "Blog" },
                { href: "/guides", label: "Guides" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] mb-4">
              Contact &amp; Support
            </h4>
            <ul className="list-none space-y-2">
              <li>
                <a href="mailto:mailme@himal.info.np" className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                  mailme@himal.info.np
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                  Contact Form
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                  Trending Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                  Player Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] mb-4">
              Resources
            </h4>
            <ul className="list-none space-y-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/editorial-policy", label: "Editorial Policy" },
                { href: "/blog", label: "Blog Index" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(125,211,252,0.1)] mt-12 pt-8 text-center">
          <p className="text-[var(--color-gray-400)] text-[var(--font-size-lg)]">
            &copy; {new Date().getFullYear()} iownchatgpt.com. All rights reserved. Independently maintained and regularly updated.
          </p>
        </div>
      </div>
    </footer>
  );
}
