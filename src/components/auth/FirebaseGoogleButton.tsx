"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signInWithPopup } from "firebase/auth";
import {
  firebaseAuth,
  firebaseGoogleProvider,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type FirebaseGoogleButtonProps = {
  actionLabel: string;
  callbackUrl?: string;
  onError?: (message: string) => void;
};

export function FirebaseGoogleButton({
  actionLabel,
  callbackUrl = "/",
  onError,
}: FirebaseGoogleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (!firebaseAuth || !firebaseGoogleProvider || !isFirebaseClientConfigured) {
      onError?.("Google sign-in is not configured yet.");
      return;
    }

    setLoading(true);
    onError?.("");

    try {
      const result = await signInWithPopup(firebaseAuth, firebaseGoogleProvider);
      const firebaseToken = await result.user.getIdToken();

      const authResult = await signIn("credentials", {
        redirect: false,
        mode: "firebase",
        firebaseToken,
      });

      if (authResult?.error) {
        onError?.("Google sign-in could not be completed.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Firebase Google sign-in failed", error);
      onError?.("Google sign-in could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 mb-6 rounded-lg border border-[rgba(125,211,252,0.3)] text-white text-[var(--font-size-lg)] transition-colors hover:border-[var(--color-cyan)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: "rgba(255,255,255,0.05)" }}
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {loading ? "Connecting..." : actionLabel}
    </button>
  );
}
