CREATE TABLE "article_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"reviewer_id" uuid,
	"action" varchar(30) NOT NULL,
	"before_status" varchar(20),
	"after_status" varchar(20),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_key" varchar(80) NOT NULL,
	"slot" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"model" varchar(50),
	"source_count" integer DEFAULT 0 NOT NULL,
	"duplicate_warning" boolean DEFAULT false NOT NULL,
	"source_summary" jsonb,
	"error_message" text,
	"publish_outcome" varchar(30),
	"published_slug" varchar(220),
	"triggered_by" varchar(30) DEFAULT 'scheduler' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "article_runs_run_key_unique" UNIQUE("run_key")
);
--> statement-breakpoint
CREATE TABLE "article_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"source_url" text NOT NULL,
	"source_title" varchar(255) NOT NULL,
	"publisher" varchar(120),
	"published_at" timestamp,
	"excerpt" text,
	"category_tag" varchar(40) NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"body_html" text NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"article_type" varchar(30) DEFAULT 'daily-roundup' NOT NULL,
	"category" varchar(50) DEFAULT 'Daily Roundup' NOT NULL,
	"slot" varchar(20) NOT NULL,
	"keywords" text,
	"author_label" varchar(100) DEFAULT 'iownchatgpt News Desk' NOT NULL,
	"disclosure" text NOT NULL,
	"hero_image_url" text,
	"seo_title" varchar(255),
	"seo_description" text,
	"source_count" integer DEFAULT 0 NOT NULL,
	"duplicate_warning" boolean DEFAULT false NOT NULL,
	"run_id" integer,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "editorial_settings" (
	"key" varchar(20) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"automation_enabled" boolean DEFAULT true NOT NULL,
	"tracked_topics" jsonb DEFAULT '["AI","Tech","Crypto","Consumer Electronics"]'::jsonb NOT NULL,
	"schedule_slots" jsonb DEFAULT '[{"slot":"morning","hour":8,"minute":0},{"slot":"midday","hour":13,"minute":0},{"slot":"evening","hour":19,"minute":0}]'::jsonb NOT NULL,
	"max_sources_per_run" integer DEFAULT 9 NOT NULL,
	"model" varchar(50) DEFAULT 'gemini-2.5-flash' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_reviews" ADD CONSTRAINT "article_reviews_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_reviews" ADD CONSTRAINT "article_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_sources" ADD CONSTRAINT "article_sources_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_run_id_article_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."article_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_reviews_article_created_idx" ON "article_reviews" USING btree ("article_id","created_at");--> statement-breakpoint
CREATE INDEX "article_runs_slot_started_idx" ON "article_runs" USING btree ("slot","started_at");--> statement-breakpoint
CREATE INDEX "article_sources_article_rank_idx" ON "article_sources" USING btree ("article_id","rank");--> statement-breakpoint
CREATE INDEX "articles_published_idx" ON "articles" USING btree ("status","published_at");