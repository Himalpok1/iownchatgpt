import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { db, editorialSettings, isDatabaseConfigured } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  automationEnabled: z.boolean(),
  trackedTopics: z.array(z.string().trim().min(1)).min(1),
  scheduleSlots: z
    .array(
      z.object({
        slot: z.enum(["morning", "midday", "evening"]),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59),
      })
    )
    .length(3),
  maxSourcesPerRun: z.number().int().min(4).max(12),
  model: z.string().trim().min(1).max(50),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid settings" }, { status: 400 });
  }

  const [settings] = await db
    .insert(editorialSettings)
    .values({
      key: "default",
      ...parsed.data,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: editorialSettings.key,
      set: {
        ...parsed.data,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json({ settings });
}
