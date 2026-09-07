import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = db.select().from(orders);
    if (status) {
      // @ts-ignore
      query = query.where(eq(orders.status, status));
    }

    const allOrders = await query.orderBy(desc(orders.id));

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (ord) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, ord.id));
        return { ...ord, items };
      })
    );

    return NextResponse.json({ success: true, data: ordersWithItems });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const orderNum = `CP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber: orderNum,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        shippingAddress: body.shippingAddress,
        city: body.city,
        vehicleInfo: body.vehicleInfo || null,
        totalAmount: String(body.totalAmount),
        status: "جديد",
        paymentMethod: body.paymentMethod || "الدفع عند الاستلام",
        paymentStatus: body.paymentMethod === "بطاقة ائتمانية / مدى" ? "مدفوع" : "في الانتظار",
        notes: body.notes || "",
      })
      .returning();

    const orderId = newOrder[0].id;

    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId || null,
          productTitle: item.productTitle,
          oemNumber: item.oemNumber || "-",
          price: String(item.price),
          quantity: Number(item.quantity) || 1,
        });
      }
    }

    return NextResponse.json({ success: true, data: { ...newOrder[0], orderNumber: orderNum } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
