"use client";

import Link from "next/link";
import { useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[rgba(125,211,252,0.2)] transition-all duration-[var(--duration-normal)]"
      style={{ backgroundColor: "rgba(7, 14, 30, 0.8)", backdropFilter: "blur(14px)" }}>
      <div className="max-w-[1200px] mx-auto px-[var(--space-24)] py-[var(--space-16)] flex justify-between items-center">
        <Link href="/" className="text-[var(--font-size-3xl)] font-[var(--font-weight-bold)] no-underline"
          style={{
            background: "linear-gradient(135deg, var(--color-purple), var(--color-cyan))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "var(--font-size-3xl)",
            fontWeight: "var(--font-weight-bold)",
          }}>
          iownchatgpt
        </Link>

        {/* Desktop Menu + Auth */}
        <div className="hidden md:flex items-center gap-[var(--space-32)]">
          <ul className="flex list-none gap-[var(--space-32)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-[var(--color-gray-200)] no-underline text-[var(--font-size-lg)] font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-cyan)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <UserMenu />
        </div>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col cursor-pointer gap-[5px] bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[25px] h-[3px] rounded-sm transition-all duration-[var(--duration-normal)]"
            style={{
              backgroundColor: "var(--color-gray-200)",
              transform: menuOpen ? "rotate(45deg) translate(8px, 8px)" : "none",
            }}
          />
          <span
            className="block w-[25px] h-[3px] rounded-sm transition-all duration-[var(--duration-normal)]"
            style={{
              backgroundColor: "var(--color-gray-200)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-[25px] h-[3px] rounded-sm transition-all duration-[var(--duration-normal)]"
            style={{
              backgroundColor: "var(--color-gray-200)",
              transform: menuOpen ? "rotate(-45deg) translate(7px, -7px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(125,211,252,0.1)]"
          style={{ backgroundColor: "rgba(7, 14, 30, 0.95)" }}>
          <ul className="list-none flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-[var(--space-24)] py-3 text-[var(--color-gray-200)] no-underline text-[var(--font-size-lg)] hover:text-[var(--color-cyan)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
