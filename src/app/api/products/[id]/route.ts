import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productFitments, vehicles, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);

    const rows = await db
      .select({
        product: products,
        categoryNameAr: categories.nameAr,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, prodId));

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const prod = rows[0].product;

    // Fetch fitments
    const fitments = await db
      .select({
        fitmentId: productFitments.id,
        notes: productFitments.notes,
        make: vehicles.make,
        model: vehicles.model,
        yearStart: vehicles.yearStart,
        yearEnd: vehicles.yearEnd,
        engine: vehicles.engine,
      })
      .from(productFitments)
      .innerJoin(vehicles, eq(productFitments.vehicleId, vehicles.id))
      .where(eq(productFitments.productId, prodId));

    // Fetch reviews
    const prodReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, prodId));

    const result = {
      ...prod,
      categoryNameAr: rows[0].categoryNameAr,
      categorySlug: rows[0].categorySlug,
      imagesList: typeof prod.images === "string" ? JSON.parse(prod.images) : [],
      specificationsObj: typeof prod.specifications === "string" ? JSON.parse(prod.specifications) : {},
      fitments,
      reviewsList: prodReviews,
    };

    return NextResponse.json({ success: true, data: result });
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
    const prodId = parseInt(id, 10);
    const body = await request.json();

    const updated = await db
      .update(products)
      .set({
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        slug: body.slug,
        sku: body.sku,
        oemNumber: body.oemNumber,
        brand: body.brand,
        condition: body.condition,
        categoryId: Number(body.categoryId),
        price: String(body.price),
        salePrice: body.salePrice ? String(body.salePrice) : null,
        stock: Number(body.stock),
        descriptionAr: body.descriptionAr,
        specifications: typeof body.specifications === "object" ? JSON.stringify(body.specifications) : body.specifications,
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : body.images,
        isFeatured: Boolean(body.isFeatured),
        isBestSeller: Boolean(body.isBestSeller),
      })
      .where(eq(products.id, prodId))
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
    const prodId = parseInt(id, 10);

    await db.delete(products).where(eq(products.id, prodId));
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
