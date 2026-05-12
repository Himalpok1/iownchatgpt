import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  serial,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ===== Users =====
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  // NextAuth required columns
  name: text("name"),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  // App-specific columns
  username: varchar("username", { length: 30 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  avatarUrl: text("avatar_url"),
  provider: varchar("provider", { length: 20 }).default("credentials"), // 'credentials' | 'google' | 'github'
  providerId: varchar("provider_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NextAuth required tables
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    // DrizzleAdapter requires snake_case property names for these columns
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    providerIdx: uniqueIndex("accounts_provider_idx").on(
      account.provider,
      account.providerAccountId
    ),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundIdx: uniqueIndex("verification_tokens_idx").on(
      vt.identifier,
      vt.token
    ),
  })
);

// ===== Games Registry =====
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 30 }), // 'arcade' | 'puzzle' | 'strategy' | 'multiplayer'
  scoreType: varchar("score_type", { length: 20 }).default("points"), // 'points' | 'time' | 'level'
  sortOrder: varchar("sort_order", { length: 4 }).default("desc"), // 'desc' = high score wins, 'asc' = low time wins
  multiplayerEnabled: boolean("multiplayer_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== Scores (Leaderboard) =====
export const scores = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    metadata: jsonb("metadata"), // { level, time, moves, etc. }
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (score) => ({
    gameScoreIdx: index("scores_game_score_idx").on(score.gameId, score.score),
    userGameIdx: index("scores_user_game_idx").on(score.userId, score.gameId),
  })
);

// ===== Game Sessions (Analytics) =====
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  gameId: integer("game_id").references(() => games.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 36 }), // anonymous session tracking
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationMs: integer("duration_ms"),
  finalScore: integer("final_score"),
  completed: boolean("completed").default(false),
  deviceType: varchar("device_type", { length: 10 }), // 'desktop' | 'mobile' | 'tablet'
  metadata: jsonb("metadata"),
});

// ===== Multiplayer Rooms =====
export const multiplayerRooms = pgTable("multiplayer_rooms", {
  id: varchar("id", { length: 8 }).primaryKey(), // short room code e.g. 'PONG-A3X7'
  gameId: integer("game_id").references(() => games.id),
  hostUserId: uuid("host_user_id").references(() => users.id),
  state: varchar("state", { length: 20 }).default("waiting"), // 'waiting' | 'playing' | 'finished'
  maxPlayers: integer("max_players").default(2),
  gameState: jsonb("game_state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Game = typeof games.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type NewScore = typeof scores.$inferInsert;
export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
