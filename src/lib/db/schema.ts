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

// ===== Contact & Request Inbox =====
export const inquiries = pgTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 20 }).notNull(), // 'contact' | 'game_request'
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 200 }),
    message: text("message").notNull(),
    status: varchar("status", { length: 20 }).default("new").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (inquiry) => ({
    typeCreatedIdx: index("inquiries_type_created_idx").on(
      inquiry.type,
      inquiry.createdAt
    ),
  })
);

// ===== Editorial / AI Newsroom =====
export const editorialSettings = pgTable("editorial_settings", {
  key: varchar("key", { length: 20 }).primaryKey().default("default"),
  automationEnabled: boolean("automation_enabled").default(true).notNull(),
  trackedTopics: jsonb("tracked_topics").default(["AI", "Tech", "Crypto", "Consumer Electronics"]).notNull(),
  scheduleSlots: jsonb("schedule_slots")
    .default([
      { slot: "morning", hour: 8, minute: 0 },
      { slot: "midday", hour: 13, minute: 0 },
      { slot: "evening", hour: 19, minute: 0 },
    ])
    .notNull(),
  maxSourcesPerRun: integer("max_sources_per_run").default(9).notNull(),
  model: varchar("model", { length: 50 }).default("gemini-2.5-flash").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articleRuns = pgTable(
  "article_runs",
  {
    id: serial("id").primaryKey(),
    runKey: varchar("run_key", { length: 80 }).unique().notNull(),
    slot: varchar("slot", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    model: varchar("model", { length: 50 }),
    sourceCount: integer("source_count").default(0).notNull(),
    duplicateWarning: boolean("duplicate_warning").default(false).notNull(),
    sourceSummary: jsonb("source_summary"),
    errorMessage: text("error_message"),
    publishOutcome: varchar("publish_outcome", { length: 30 }),
    publishedSlug: varchar("published_slug", { length: 220 }),
    triggeredBy: varchar("triggered_by", { length: 30 }).default("scheduler").notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (run) => ({
    slotStartedIdx: index("article_runs_slot_started_idx").on(run.slot, run.startedAt),
  })
);

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 220 }).unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    summary: text("summary").notNull(),
    bodyHtml: text("body_html").notNull(),
    status: varchar("status", { length: 20 }).default("published").notNull(),
    articleType: varchar("article_type", { length: 30 }).default("daily-roundup").notNull(),
    category: varchar("category", { length: 50 }).default("Daily Roundup").notNull(),
    slot: varchar("slot", { length: 20 }).notNull(),
    keywords: text("keywords"),
    authorLabel: varchar("author_label", { length: 100 }).default("iownchatgpt News Desk").notNull(),
    disclosure: text("disclosure").notNull(),
    heroImageUrl: text("hero_image_url"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    sourceCount: integer("source_count").default(0).notNull(),
    duplicateWarning: boolean("duplicate_warning").default(false).notNull(),
    runId: integer("run_id").references(() => articleRuns.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (article) => ({
    publishedIdx: index("articles_published_idx").on(article.status, article.publishedAt),
  })
);

export const articleSources = pgTable(
  "article_sources",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    sourceUrl: text("source_url").notNull(),
    sourceTitle: varchar("source_title", { length: 255 }).notNull(),
    publisher: varchar("publisher", { length: 120 }),
    publishedAt: timestamp("published_at"),
    excerpt: text("excerpt"),
    categoryTag: varchar("category_tag", { length: 40 }).notNull(),
    rank: integer("rank").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (source) => ({
    articleRankIdx: index("article_sources_article_rank_idx").on(source.articleId, source.rank),
  })
);

export const articleReviews = pgTable(
  "article_reviews",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 30 }).notNull(),
    beforeStatus: varchar("before_status", { length: 20 }),
    afterStatus: varchar("after_status", { length: 20 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (review) => ({
    articleCreatedIdx: index("article_reviews_article_created_idx").on(
      review.articleId,
      review.createdAt
    ),
  })
);

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
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type EditorialSettings = typeof editorialSettings.$inferSelect;
export type NewEditorialSettings = typeof editorialSettings.$inferInsert;
export type ArticleRun = typeof articleRuns.$inferSelect;
export type NewArticleRun = typeof articleRuns.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ArticleSource = typeof articleSources.$inferSelect;
export type NewArticleSource = typeof articleSources.$inferInsert;
export type ArticleReview = typeof articleReviews.$inferSelect;
export type NewArticleReview = typeof articleReviews.$inferInsert;
