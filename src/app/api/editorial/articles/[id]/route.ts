import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { db, articleReviews, articles, isDatabaseConfigured } from "@/lib/db";
import { sanitizeArticleHtml } from "@/lib/editorial/html";
import { z } from "zod";

const articlePatchSchema = z.object({
  title: z.string().trim().min(10).max(255).optional(),
  summary: z.string().trim().min(20).max(500).optional(),
  bodyHtml: z.string().trim().min(50).optional(),
  heroImageUrl: z.string().trim().url().or(z.literal("")).optional(),
  status: z.enum(["published", "unpublished", "archived"]).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = articlePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid article payload." }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const updatePayload: Partial<typeof articles.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.data.title !== undefined) updatePayload.title = parsed.data.title;
  if (parsed.data.summary !== undefined) updatePayload.summary = parsed.data.summary;
  if (parsed.data.bodyHtml !== undefined) {
    updatePayload.bodyHtml = sanitizeArticleHtml(parsed.data.bodyHtml);
  }
  if (parsed.data.heroImageUrl !== undefined) {
    updatePayload.heroImageUrl = parsed.data.heroImageUrl || null;
  }
  if (parsed.data.status !== undefined) {
    updatePayload.status = parsed.data.status;
  }

  const [updated] = await db
    .update(articles)
    .set(updatePayload)
    .where(and(eq(articles.id, articleId)))
    .returning();

  await db.insert(articleReviews).values({
    articleId,
    reviewerId: session?.user?.id ?? null,
    action: parsed.data.status && parsed.data.status !== existing.status ? parsed.data.status : "edited",
    beforeStatus: existing.status,
    afterStatus: updated.status,
    notes: parsed.data.notes ?? "Updated from the admin panel.",
  });

  return NextResponse.json({ article: updated });
}
