import { NextResponse } from "next/server";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id, 10);
    const body = await request.json();

    const updated = await db
      .update(heroSlides)
      .set({
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        subtitleAr: body.subtitleAr,
        badgeAr: body.badgeAr,
        buttonTextAr: body.buttonTextAr,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        displayOrder: Number(body.displayOrder) || 1,
        isActive: Boolean(body.isActive),
      })
      .where(eq(heroSlides.id, slideId))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id, 10);

    await db.delete(heroSlides).where(eq(heroSlides.id, slideId));
    return NextResponse.json({ success: true, message: "Slide deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
