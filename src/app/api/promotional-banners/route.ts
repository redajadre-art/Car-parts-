import { NextResponse } from "next/server";
import { db } from "@/db";
import { promotionalBanners } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { eq } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  try {
    const banners = await db.select().from(promotionalBanners);
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(promotionalBanners)
      .values({
        titleAr: body.titleAr,
        subtitleAr: body.subtitleAr,
        discountTag: body.discountTag || "عرض خاص",
        buttonText: body.buttonText || "تسوق العرض",
        buttonLink: body.buttonLink || "/products",
        imageUrl: body.imageUrl,
        bgGradient: body.bgGradient || "from-red-600 to-amber-600",
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
