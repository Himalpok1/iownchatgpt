import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";

const loginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  mode: z.enum(["password", "firebase"]).optional(),
  firebaseToken: z.string().min(16).optional(),
});

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "iownchatgpt-local-development-secret"
    : undefined);

const googleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

type FirebaseIdentityLookupResponse = {
  users?: Array<{
    localId: string;
    email?: string;
    displayName?: string;
    photoUrl?: string;
    emailVerified?: boolean;
  }>;
};

async function lookupFirebaseUser(firebaseToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseToken }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as FirebaseIdentityLookupResponse;
  return payload.users?.[0] ?? null;
}

async function syncFirebaseUser(firebaseToken: string) {
  const firebaseProfile = await lookupFirebaseUser(firebaseToken);

  if (!firebaseProfile) {
    return null;
  }

  const email = firebaseProfile.email?.toLowerCase();

  if (!email) {
    return null;
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const profilePayload = {
    name: firebaseProfile.displayName ?? firebaseProfile.email ?? null,
    image: firebaseProfile.photoUrl ?? null,
    avatarUrl: firebaseProfile.photoUrl ?? null,
    provider: "firebase",
    providerId: firebaseProfile.localId,
    emailVerified: firebaseProfile.emailVerified ? new Date() : null,
  } as const;

  if (existingUser[0]) {
    const [updatedUser] = await db
      .update(users)
      .set(profilePayload)
      .where(eq(users.id, existingUser[0].id))
      .returning();

    return updatedUser;
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      email,
      ...profilePayload,
    })
    .returning();

  return createdUser;
}

const providers = [
  ...(googleAuthEnabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : []),
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      mode: { label: "Mode", type: "text" },
      firebaseToken: { label: "Firebase Token", type: "text" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password, mode, firebaseToken } = parsed.data;

      if (mode === "firebase" && firebaseToken) {
        const firebaseUser = await syncFirebaseUser(firebaseToken);

        if (!firebaseUser) return null;

        return {
          id: firebaseUser.id,
          email: firebaseUser.email,
          name: firebaseUser.username ?? firebaseUser.name ?? firebaseUser.email,
          image: firebaseUser.avatarUrl ?? firebaseUser.image,
        };
      }

      if (!email || !password) {
        return null;
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user[0] || !user[0].passwordHash) return null;

      const valid = await bcrypt.compare(password, user[0].passwordHash);
      if (!valid) return null;

      return {
        id: user[0].id,
        email: user[0].email,
        name: user[0].username,
        image: user[0].avatarUrl,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = isAdminEmail(user.email);
      } else if (token.email) {
        token.isAdmin = isAdminEmail(token.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
});
