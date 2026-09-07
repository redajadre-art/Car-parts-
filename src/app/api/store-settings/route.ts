import { NextResponse } from "next/server";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/db-init";

export async function GET() {
  await ensureSeeded();
  try {
    const settings = await db.select().from(storeSettings).limit(1);
    return NextResponse.json({ success: true, data: settings[0] || null });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await ensureSeeded();
  try {
    const body = await request.json();
    const updated = await db
      .update(storeSettings)
      .set({
        storeNameAr: body.storeNameAr,
        storeNameEn: body.storeNameEn,
        sloganAr: body.sloganAr,
        sloganEn: body.sloganEn,
        announcementBarText: body.announcementBarText,
        announcementEnabled: Boolean(body.announcementEnabled),
        phoneNumber: body.phoneNumber,
        whatsappNumber: body.whatsappNumber,
        email: body.email,
        address: body.address,
        currency: body.currency,
        logoUrl: body.logoUrl,
        footerAboutAr: body.footerAboutAr,
        taxNumber: body.taxNumber,
        updatedAt: new Date(),
      })
      .where(eq(storeSettings.id, 1))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
