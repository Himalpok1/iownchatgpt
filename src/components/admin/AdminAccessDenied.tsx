import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { getPublicSiteUrl } from "@/lib/hosts";

export function AdminAccessDenied({ email }: { email?: string | null }) {
  return (
    <section className="content-section">
      <div className="container page-shell max-w-[760px]">
        <div className="surface-panel home-list-card">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.08)] text-[var(--color-cyan)]">
            <ShieldAlert size={20} />
          </div>
          <div className="mt-5">
            <p className="home-section__eyebrow">Admin access</p>
            <h1 className="page-hero__title text-[clamp(2rem,4vw,3rem)]">
              You&apos;re signed in, but this newsroom is restricted.
            </h1>
            <p className="page-hero__copy mt-4">
              {email ? `${email} does not have permission to manage the newsroom.` : "This account does not have permission to manage the newsroom."} Use an approved admin account or return to the public site.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={getPublicSiteUrl()} className="btn-gradient no-underline">
              Go to the public site
            </a>
            <Link href="/profile" className="btn-secondary no-underline">
              Open my profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
