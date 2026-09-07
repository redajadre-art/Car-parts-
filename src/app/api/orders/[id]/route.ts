import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    const ord = await db.select().from(orders).where(eq(orders.id, orderId));
    if (ord.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    return NextResponse.json({ success: true, data: { ...ord[0], items } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    const body = await request.json();

    const updated = await db
      .update(orders)
      .set({
        status: body.status,
        paymentStatus: body.paymentStatus,
        notes: body.notes,
      })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
