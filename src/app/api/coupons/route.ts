import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const validateCode = searchParams.get("code");

    if (validateCode) {
      const match = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, validateCode.toUpperCase()))
        .limit(1);

      if (match.length > 0 && match[0].isActive) {
        return NextResponse.json({ success: true, data: match[0] });
      } else {
        return NextResponse.json({ success: false, error: "كود الخصم غير صالح أو منتهي" }, { status: 404 });
      }
    }

    const allCoupons = await db.select().from(coupons);
    return NextResponse.json({ success: true, data: allCoupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(coupons)
      .values({
        code: body.code.toUpperCase(),
        discountType: body.discountType || "percentage",
        discountValue: String(body.discountValue),
        minOrderAmount: String(body.minOrderAmount || "0"),
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
