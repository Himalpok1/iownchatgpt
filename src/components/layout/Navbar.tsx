"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

const adminLinks = [
  { href: "/admin/blog", label: "Newsroom" },
  { href: "/blog", label: "Public Blog" },
];

export function Navbar({ adminHost = false }: { adminHost?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = adminHost ? adminLinks : navLinks;
  const brandHref = adminHost ? "/admin/blog" : "/";
  const brandLabel = adminHost ? "iownchatgpt admin" : "iownchatgpt";

  return (
    <nav className="site-nav">
      <div className="container site-nav__inner">
        <Link href={brandHref} className="site-brand">
          <span className="site-brand__mark" aria-hidden="true" />
          <span>{brandLabel}</span>
        </Link>

        <div className="site-nav__desktop hidden md:flex items-center gap-[var(--space-32)]">
          <ul className="site-nav__links">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <UserMenu adminHost={adminHost} />
        </div>

        <button
          className="site-nav__menu md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(148,163,184,0.12)] bg-[rgba(8,17,31,0.96)]">
          <div className="container py-3">
            <ul className="list-none flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-[var(--radius-base)] px-3 py-3 text-[0.98rem] text-[var(--color-gray-100)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="container pb-4">
            <div className="rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-3">
              <UserMenu adminHost={adminHost} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
