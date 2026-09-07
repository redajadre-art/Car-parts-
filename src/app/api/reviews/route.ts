import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    let query = db.select().from(reviews);
    if (productId) {
      // @ts-ignore
      query = query.where(eq(reviews.productId, parseInt(productId, 10)));
    }

    const allReviews = await query.orderBy(desc(reviews.id));
    return NextResponse.json({ success: true, data: allReviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(reviews)
      .values({
        productId: Number(body.productId),
        customerName: body.customerName,
        rating: Number(body.rating) || 5,
        comment: body.comment,
        vehicleModel: body.vehicleModel || null,
        isApproved: true,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
