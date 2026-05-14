"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Newspaper, Trophy } from "lucide-react";
import { FirebaseGoogleButton } from "@/components/auth/FirebaseGoogleButton";

export default function RegisterPage() {
  const googleAuthEnabled = process.env.NEXT_PUBLIC_FIREBASE_AUTH_ENABLED === "true";
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        username: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }

    // Auto login after registration
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/auth/login");
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
              <p className="home-section__eyebrow">Join</p>
              <h1 className="page-hero__title">Create your account.</h1>
              <p className="page-hero__copy mt-4">
                Sign up to save scores, keep a profile, and unlock the parts of the product that
                need identity, from leaderboards to admin access.
              </p>
            </div>

            <div className="surface-panel home-list-card">
              <h3>What you get</h3>
              <div className="grid gap-4 mt-4">
                <div className="inline-flex items-center gap-3 text-[var(--color-gray-200)]">
                  <Trophy size={18} className="text-[var(--color-cyan)]" />
                  Persistent leaderboard submissions
                </div>
                <div className="inline-flex items-center gap-3 text-[var(--color-gray-200)]">
                  <Newspaper size={18} className="text-[var(--color-cyan)]" />
                  Access to the broader blog and newsroom system
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass auth-card">
            <h2
              className="text-[var(--font-size-3xl)] text-center mb-2 gradient-text"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              Create account
            </h2>
            <p className="text-center text-[var(--color-gray-300)] mb-8 text-[var(--font-size-lg)]">
              Free forever. Save scores and climb leaderboards.
            </p>

            {googleAuthEnabled && (
              <>
                <FirebaseGoogleButton
                  actionLabel="Sign up with Google"
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
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="gamer123"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-gray-300)] mb-2 text-[var(--font-size-lg)]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-gray-300)] mb-2 text-[var(--font-size-lg)]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
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
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-center mt-6 text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[var(--color-cyan)]">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
