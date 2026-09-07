import { NextResponse } from "next/server";
import { db } from "@/db";
import { customSections } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();

    const updated = await db
      .update(customSections)
      .set({
        titleAr: body.titleAr,
        subtitleAr: body.subtitleAr,
        contentJson: typeof body.contentJson === "object" ? JSON.stringify(body.contentJson) : body.contentJson,
        isActive: Boolean(body.isActive),
      })
      .where(eq(customSections.sectionKey, key))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
