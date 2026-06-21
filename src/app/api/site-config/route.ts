import connectToDatabase from "@/lib/dbConnect";
import SiteConfig from "@/models/SiteConfig";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDatabase();

    const data = await SiteConfig.findOne().lean();

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching site config.", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    try {
      await verifyAdmin(req);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: (error as Error).message },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Auto-derive brand.sameAs from social link hrefs so the
    // Organization JSON-LD stays in sync without a separate field
    if (Array.isArray(body.socialLinks)) {
      body.brand = {
        ...body.brand,
        sameAs: body.socialLinks.map((link: { href: string }) => link.href),
      };
    }

    const updated = await SiteConfig.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/site-config error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
