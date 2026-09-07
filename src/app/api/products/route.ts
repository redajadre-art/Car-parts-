import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productFitments, vehicles } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { eq, like, or, and, gte, lte, desc, asc, sql } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";
    const categoryId = searchParams.get("categoryId");
    const brand = searchParams.get("brand") || "";
    const condition = searchParams.get("condition") || "";
    const make = searchParams.get("make") || "";
    const model = searchParams.get("model") || "";
    const year = searchParams.get("year");
    const isFeatured = searchParams.get("featured");
    const isBestSeller = searchParams.get("bestSeller");
    const sort = searchParams.get("sort") || "newest";

    let query = db
      .select({
        product: products,
        categoryNameAr: categories.nameAr,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    // Vehicle Fitment Filter
    let matchingProductIds: number[] | null = null;
    if (make || model || year) {
      const yearNum = year ? parseInt(year, 10) : null;
      let vehicleConditions = [];
      if (make) vehicleConditions.push(eq(vehicles.make, make));
      if (model) vehicleConditions.push(eq(vehicles.model, model));
      if (yearNum) {
        vehicleConditions.push(lte(vehicles.yearStart, yearNum));
        vehicleConditions.push(gte(vehicles.yearEnd, yearNum));
      }

      const matchingVehicles = await db
        .select({ id: vehicles.id })
        .from(vehicles)
        .where(and(...vehicleConditions));

      const vIds = matchingVehicles.map((v) => v.id);
      if (vIds.length > 0) {
        const fitments = await db
          .select({ productId: productFitments.productId })
          .from(productFitments)
          .where(sql`${productFitments.vehicleId} IN (${sql.raw(vIds.join(","))})`);

        matchingProductIds = fitments.map((f) => f.productId);
      } else {
        matchingProductIds = [];
      }
    }

    let whereConditions = [];

    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          like(products.titleAr, searchPattern),
          like(products.oemNumber, searchPattern),
          like(products.sku, searchPattern),
          like(products.brand, searchPattern),
          like(products.descriptionAr, searchPattern)
        )
      );
    }

    if (categorySlug) {
      whereConditions.push(eq(categories.slug, categorySlug));
    }

    if (categoryId) {
      whereConditions.push(eq(products.categoryId, parseInt(categoryId, 10)));
    }

    if (brand) {
      whereConditions.push(eq(products.brand, brand));
    }

    if (condition) {
      whereConditions.push(eq(products.condition, condition));
    }

    if (isFeatured === "true") {
      whereConditions.push(eq(products.isFeatured, true));
    }

    if (isBestSeller === "true") {
      whereConditions.push(eq(products.isBestSeller, true));
    }

    if (matchingProductIds !== null) {
      if (matchingProductIds.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }
      whereConditions.push(
        sql`${products.id} IN (${sql.raw(matchingProductIds.join(","))})`
      );
    }

    let finalQuery = query;
    if (whereConditions.length > 0) {
      // @ts-ignore
      finalQuery = finalQuery.where(and(...whereConditions));
    }

    // Sorting
    if (sort === "price-asc") {
      // @ts-ignore
      finalQuery = finalQuery.orderBy(asc(products.price));
    } else if (sort === "price-desc") {
      // @ts-ignore
      finalQuery = finalQuery.orderBy(desc(products.price));
    } else if (sort === "rating") {
      // @ts-ignore
      finalQuery = finalQuery.orderBy(desc(products.rating));
    } else {
      // newest
      // @ts-ignore
      finalQuery = finalQuery.orderBy(desc(products.id));
    }

    const rows = await finalQuery;

    // Format results
    const results = rows.map((r) => ({
      ...r.product,
      categoryNameAr: r.categoryNameAr,
      categorySlug: r.categorySlug,
      imagesList: typeof r.product.images === "string" ? JSON.parse(r.product.images) : [],
      specificationsObj: typeof r.product.specifications === "string" ? JSON.parse(r.product.specifications) : {},
    }));

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(products)
      .values({
        titleAr: body.titleAr,
        titleEn: body.titleEn || null,
        slug: body.slug || body.titleAr.toLowerCase().replace(/\s+/g, "-"),
        sku: body.sku || `SKU-${Date.now()}`,
        oemNumber: body.oemNumber,
        brand: body.brand,
        condition: body.condition || "أصلي OEM",
        categoryId: Number(body.categoryId),
        price: String(body.price),
        salePrice: body.salePrice ? String(body.salePrice) : null,
        stock: Number(body.stock) || 10,
        rating: "5.0",
        reviewsCount: 0,
        descriptionAr: body.descriptionAr,
        specifications: typeof body.specifications === "object" ? JSON.stringify(body.specifications) : body.specifications || "{}",
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : JSON.stringify([body.images || "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"]),
        isFeatured: Boolean(body.isFeatured),
        isBestSeller: Boolean(body.isBestSeller),
      })
      .returning();

    // Optionally handle fitments if passed
    if (body.vehicleFitments && Array.isArray(body.vehicleFitments)) {
      for (const vId of body.vehicleFitments) {
        await db.insert(productFitments).values({
          productId: created[0].id,
          vehicleId: Number(vId),
          notes: "توافق مباشر مع المركبة",
        });
      }
    }

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
