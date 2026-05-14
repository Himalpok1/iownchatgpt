"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Trophy } from "lucide-react";
import { FirebaseGoogleButton } from "@/components/auth/FirebaseGoogleButton";

export default function LoginPage() {
  const googleAuthEnabled = process.env.NEXT_PUBLIC_FIREBASE_AUTH_ENABLED === "true";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="page-two-col auth-page__layout">
          <div className="home-stack">
            <div>
              <p className="home-section__eyebrow">Account</p>
              <h1 className="page-hero__title">Welcome back.</h1>
              <p className="page-hero__copy mt-4">
                Log in to save scores, track your profile, and move between play,
                rankings, and the newsroom with a single account.
              </p>
            </div>

            <div className="surface-panel home-list-card">
              <h3>Why sign in</h3>
              <ul>
                <li>Save scores to the real leaderboard.</li>
                <li>Track recent runs and personal bests.</li>
                <li>Access protected admin surfaces if your account is authorized.</li>
              </ul>
            </div>

            <div className="surface-panel home-list-card">
              <h3>What stays true</h3>
              <div className="grid gap-4 mt-4">
                <div className="inline-flex items-center gap-3 text-[var(--color-gray-200)]">
                  <Trophy size={18} className="text-[var(--color-cyan)]" />
                  Competitive play stays optional.
                </div>
                <div className="inline-flex items-center gap-3 text-[var(--color-gray-200)]">
                  <ShieldCheck size={18} className="text-[var(--color-cyan)]" />
                  Admin routes remain locked to approved emails.
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass auth-card">
            <h2
              className="text-[var(--font-size-3xl)] text-center mb-2 gradient-text"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              Log in
            </h2>
            <p className="text-center text-[var(--color-gray-300)] mb-8 text-[var(--font-size-lg)]">
              Save scores and compete on leaderboards
            </p>

            {googleAuthEnabled && (
              <>
                <FirebaseGoogleButton
                  actionLabel="Continue with Google"
                  onError={setError}
                />

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[rgba(125,211,252,0.15)]" />
                  <span className="text-[var(--color-gray-400)] text-sm">or</span>
                  <div className="flex-1 h-px bg-[rgba(125,211,252,0.15)]" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[var(--color-gray-300)] mb-2 text-[var(--font-size-lg)]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-gray-300)] mb-2 text-[var(--font-size-lg)]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              {error && (
                <p className="text-[var(--color-error-red)] text-[var(--font-size-lg)] text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="text-center mt-6 text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[var(--color-cyan)]">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
