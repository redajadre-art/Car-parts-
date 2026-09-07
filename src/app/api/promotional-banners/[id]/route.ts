import { NextResponse } from "next/server";
import { db } from "@/db";
import { promotionalBanners } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id, 10);
    const body = await request.json();

    const updated = await db
      .update(promotionalBanners)
      .set({
        titleAr: body.titleAr,
        subtitleAr: body.subtitleAr,
        discountTag: body.discountTag,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        bgGradient: body.bgGradient,
        isActive: Boolean(body.isActive),
      })
      .where(eq(promotionalBanners.id, bannerId))
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
    const bannerId = parseInt(id, 10);

    await db.delete(promotionalBanners).where(eq(promotionalBanners.id, bannerId));
    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
