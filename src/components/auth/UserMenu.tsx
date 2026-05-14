"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { getPublicSiteUrl } from "@/lib/hosts";

export function UserMenu({
  adminHost = false,
}: {
  adminHost?: boolean;
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full animate-pulse"
        style={{ background: "rgba(125, 211, 252, 0.2)" }} />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)] no-underline"
        >
          Log in
        </Link>
        {!adminHost ? (
          <Link
            href="/auth/register"
            className="btn-gradient text-sm px-4 py-2 no-underline"
            style={{ padding: "6px 16px", fontSize: "var(--font-size-lg)" }}
          >
            Sign up
          </Link>
        ) : null}
      </div>
    );
  }

  const initials = session.user?.name?.[0]?.toUpperCase() ??
    session.user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
      >
        {session.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-[rgba(125,211,252,0.3)]"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, var(--color-purple), var(--color-cyan))" }}
          >
            {initials}
          </div>
        )}
        <span className="hidden md:block text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
          {session.user?.name ?? session.user?.email?.split("@")[0]}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 w-44 rounded-xl border border-[rgba(125,211,252,0.2)] py-2 z-50"
          style={{ background: "rgba(7, 14, 30, 0.98)", backdropFilter: "blur(14px)" }}
        >
          <Link
            href="/profile"
            className="block px-4 py-2 text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)] no-underline"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="/leaderboards"
            className="block px-4 py-2 text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)] no-underline"
            onClick={() => setOpen(false)}
          >
            Leaderboards
          </Link>
          {session.user?.isAdmin ? (
            <Link
              href="/admin/blog"
              className="block px-4 py-2 text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)] no-underline"
              onClick={() => setOpen(false)}
            >
              Admin Newsroom
            </Link>
          ) : null}
          {adminHost && session.user?.isAdmin ? (
            <a
              href={getPublicSiteUrl()}
              className="block px-4 py-2 text-[var(--color-gray-300)] hover:text-[var(--color-cyan)] transition-colors text-[var(--font-size-lg)] no-underline"
              onClick={() => setOpen(false)}
            >
              Public Site
            </a>
          ) : null}
          <div className="border-t border-[rgba(125,211,252,0.1)] my-1" />
          <button
            onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
            className="block w-full text-left px-4 py-2 text-[var(--color-gray-300)] hover:text-red-400 transition-colors text-[var(--font-size-lg)] bg-transparent border-none cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
