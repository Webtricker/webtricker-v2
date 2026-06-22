import dbConnect from "@/lib/dbConnect";
import Career from "@/models/Career";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

const cleanList = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];

const normalizeCareerPayload = (body: Record<string, any>) => ({
  ...body,
  vacancyCount: Number(body.vacancyCount) || 0,
  responsibilities: cleanList(body.responsibilities),
  requirements: cleanList(body.requirements),
  niceToHave: cleanList(body.niceToHave),
  benefits: cleanList(body.benefits),
  applicationDeadline: body.applicationDeadline || undefined,
  salaryRange: body.salaryRange || undefined,
  howToApply: body.howToApply || undefined,
  seoTitle: body.seoTitle || undefined,
  seoDescription: body.seoDescription || undefined,
  focusKeyword: body.focusKeyword || undefined,
  canonicalUrl: body.canonicalUrl || undefined,
  ogImage: body.ogImage || undefined,
  ogImageAlt: body.ogImageAlt || undefined,
  featured: Boolean(body.featured),
  published: Boolean(body.published),
});

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 100)));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (published === "true") query.published = true;
    if (featured === "true") query.featured = true;

    const [careers, total] = await Promise.all([
      Career.find(query)
        .sort({ featured: -1, updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Career.countDocuments(query),
    ]);

    return NextResponse.json(
      { success: true, careers, pagination: { total, page, limit } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching career listings:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    await verifyAdmin(req);

    const body = await req.json();
    if (!body?.slug || !body?.title) {
      return NextResponse.json(
        { success: false, message: "slug and title are required" },
        { status: 400 }
      );
    }

    const career = new Career(normalizeCareerPayload(body));
    await career.save();

    return NextResponse.json(
      { success: true, message: "Career listing created", career },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating career listing:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A career listing with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
