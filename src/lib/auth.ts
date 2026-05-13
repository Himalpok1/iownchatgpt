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
  email: z.string().email(),
  password: z.string().min(8),
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
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;

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
