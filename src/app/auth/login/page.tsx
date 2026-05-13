"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Trophy } from "lucide-react";

export default function LoginPage() {
  const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
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

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="container">
        <div className="page-two-col items-start">
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

          <div className="card-glass w-full max-w-[420px] p-8 justify-self-end">
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
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 mb-6 rounded-lg border border-[rgba(125,211,252,0.3)] text-white text-[var(--font-size-lg)] transition-colors hover:border-[var(--color-cyan)] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

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
