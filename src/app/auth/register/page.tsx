"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="card-glass w-full max-w-[420px] p-8">
        <h1
          className="text-[var(--font-size-4xl)] text-center mb-2 gradient-text"
          style={{ fontWeight: "var(--font-weight-bold)" }}
        >
          Create account
        </h1>
        <p className="text-center text-[var(--color-gray-300)] mb-8 text-[var(--font-size-lg)]">
          Free forever. Save scores and climb leaderboards.
        </p>

        {/* Google OAuth */}
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
          Sign up with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[rgba(125,211,252,0.15)]" />
          <span className="text-[var(--color-gray-400)] text-sm">or</span>
          <div className="flex-1 h-px bg-[rgba(125,211,252,0.15)]" />
        </div>

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
  );
}
