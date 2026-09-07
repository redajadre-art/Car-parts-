import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, categories, reviews, vehicles } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { sql, lte } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  try {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);
    const allReviews = await db.select().from(reviews);

    const totalSales = allOrders.reduce((sum, ord) => sum + parseFloat(ord.totalAmount || "0"), 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === "جديد" || o.status === "قيد المعالجة").length;
    const totalProducts = allProducts.length;
    const lowStockProducts = allProducts.filter(p => p.stock <= 15);

    return NextResponse.json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        pendingOrders,
        totalProducts,
        totalCategories: allCategories.length,
        totalReviews: allReviews.length,
        lowStockCount: lowStockProducts.length,
        lowStockList: lowStockProducts.map(p => ({
          id: p.id,
          titleAr: p.titleAr,
          oemNumber: p.oemNumber,
          stock: p.stock,
        })),
        recentOrders: allOrders.slice(0, 5),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
