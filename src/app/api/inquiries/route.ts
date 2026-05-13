import { NextResponse } from "next/server";
import { z } from "zod";
import { db, inquiries, isDatabaseConfigured } from "@/lib/db";

const inquirySchema = z.object({
  type: z.enum(["contact", "game_request"]),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address"),
  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long")
    .optional()
    .transform((value) => value || undefined),
  message: z
    .string()
    .trim()
    .min(10, "Please share a bit more detail")
    .max(5000, "Message is too long"),
});

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { error: "Inquiry inbox is not configured yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [inquiry] = await db
      .insert(inquiries)
      .values({
        type: parsed.data.type,
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
      })
      .returning({
        id: inquiries.id,
        type: inquiries.type,
        createdAt: inquiries.createdAt,
      });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
