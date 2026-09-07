import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { ensureSeeded } from "@/lib/db-init";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");

    if (make) {
      const modelsList = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.make, make));
      return NextResponse.json({ success: true, data: modelsList });
    }

    const allVehicles = await db.select().from(vehicles);
    return NextResponse.json({ success: true, data: allVehicles });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const created = await db
      .insert(vehicles)
      .values({
        make: body.make,
        model: body.model,
        yearStart: Number(body.yearStart),
        yearEnd: Number(body.yearEnd),
        engine: body.engine || "Standard Engine",
      })
      .returning();

    return NextResponse.json({ success: true, data: created[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
