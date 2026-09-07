import { NextResponse } from "next/server";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  try {
    const slides = await db
      .select()
      .from(heroSlides)
      .orderBy(asc(heroSlides.displayOrder));
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(heroSlides)
      .values({
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        subtitleAr: body.subtitleAr,
        badgeAr: body.badgeAr || "خصم خاص",
        buttonTextAr: body.buttonTextAr || "تسوق الآن",
        buttonLink: body.buttonLink || "/products",
        imageUrl: body.imageUrl,
        displayOrder: Number(body.displayOrder) || 1,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
