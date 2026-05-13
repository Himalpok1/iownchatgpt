import Link from "next/link";
import { BookOpenText, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <div className="site-brand mb-4">
              <span className="site-brand__mark" aria-hidden="true" />
              <span>iownchatgpt</span>
            </div>
            <p className="site-footer__copy border-0 p-0">
              A calmer place to play browser games, check leaderboards, and read
              practical guides without the junk around them.
            </p>
          </div>

          <div>
            <h4 className="site-footer__title">
              Quick Links
            </h4>
            <ul className="site-footer__list">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "Games" },
                { href: "/blog", label: "Blog" },
                { href: "/guides", label: "Guides" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="site-footer__title">
              Contact &amp; Support
            </h4>
            <ul className="site-footer__list">
              <li>
                <a href="mailto:mailme@himal.info.np" className="inline-flex items-center gap-2">
                  <Mail size={14} />
                  mailme@himal.info.np
                </a>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <BookOpenText size={14} />
                  Contact Form
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  Trending Blog
                </Link>
              </li>
              <li>
                <Link href="/guides">
                  Player Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="site-footer__title">
              Resources
            </h4>
            <ul className="site-footer__list">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/editorial-policy", label: "Editorial Policy" },
                { href: "/blog", label: "Blog Index" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={14} />
                  Editorially maintained
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="site-footer__copy">
          &copy; {new Date().getFullYear()} iownchatgpt.com. All rights
          reserved. Independently maintained and regularly updated.
        </p>
      </div>
    </footer>
  );
}
