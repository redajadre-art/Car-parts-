import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { asc } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  try {
    const list = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.displayOrder));
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
      .insert(categories)
      .values({
        slug: body.slug || body.nameAr.toLowerCase().replace(/\s+/g, "-"),
        nameAr: body.nameAr,
        nameEn: body.nameEn || null,
        descriptionAr: body.descriptionAr || "",
        iconName: body.iconName || "Wrench",
        imageUrl: body.imageUrl,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
        displayOrder: Number(body.displayOrder) || 1,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
