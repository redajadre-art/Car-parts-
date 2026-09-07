import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const catId = parseInt(id, 10);
    const body = await request.json();

    const updated = await db
      .update(categories)
      .set({
        slug: body.slug,
        nameAr: body.nameAr,
        nameEn: body.nameEn || null,
        descriptionAr: body.descriptionAr,
        iconName: body.iconName,
        imageUrl: body.imageUrl,
        isFeatured: Boolean(body.isFeatured),
        displayOrder: Number(body.displayOrder) || 1,
      })
      .where(eq(categories.id, catId))
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
    const catId = parseInt(id, 10);

    await db.delete(categories).where(eq(categories.id, catId));
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
