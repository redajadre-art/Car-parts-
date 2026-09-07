import { NextResponse } from "next/server";
import { db } from "@/db";
import { customSections } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { eq } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  try {
    const list = await db.select().from(customSections);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(customSections)
      .values({
        sectionKey: body.sectionKey,
        titleAr: body.titleAr,
        subtitleAr: body.subtitleAr,
        contentJson: typeof body.contentJson === "object" ? JSON.stringify(body.contentJson) : body.contentJson,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
