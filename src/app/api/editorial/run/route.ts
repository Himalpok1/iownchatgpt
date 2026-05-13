import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { runEditorialGeneration } from "@/lib/editorial/service";
import type { EditorialSlotName } from "@/lib/editorial/settings";

function isAuthorizedRequest(request: Request, email?: string | null) {
  const secret = process.env.EDITORIAL_CRON_SECRET;
  const header = request.headers.get("x-editorial-secret");

  if (secret && header === secret) {
    return true;
  }

  return isAdminEmail(email);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!isAuthorizedRequest(request, session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const slot = typeof body.slot === "string" ? (body.slot as EditorialSlotName) : undefined;

    const result = await runEditorialGeneration({
      slot,
      triggeredBy: isAdminEmail(session?.user?.email) ? "admin" : "scheduler",
    });

    return NextResponse.json(
      {
        article: {
          id: result.article.id,
          slug: result.article.slug,
          title: result.article.title,
        },
        sourceCount: result.sources.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Editorial run failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to generate editorial roundup.",
      },
      { status: 500 }
    );
  }
}
