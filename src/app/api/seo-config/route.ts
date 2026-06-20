import connectToDatabase from "@/lib/dbConnect";
import SeoConfig, { defaultSeoConfig } from "@/models/SeoConfig";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDatabase();

    let config = await SeoConfig.findOne().lean();

    if (!config) {
      const created = await SeoConfig.create(defaultSeoConfig);
      config = created.toObject();
    }

    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    console.error("Error fetching SEO config:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    await verifyAdmin(req);

    const body = await req.json();
    const { weights, thresholds, lastReviewed } = body;

    const update: Record<string, unknown> = {};
    if (weights) update.weights = weights;
    if (thresholds) update.thresholds = thresholds;
    if (lastReviewed !== undefined) update.lastReviewed = lastReviewed;

    const config = await SeoConfig.findOneAndUpdate(
      {},
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating SEO config:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
