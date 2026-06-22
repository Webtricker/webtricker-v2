import dbConnect from "@/lib/dbConnect";
import Career from "@/models/Career";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ slug: string }> };

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

export const GET = async (_: NextRequest, { params }: Params) => {
  const { slug } = await params;
  try {
    await dbConnect();
    const career = await Career.findOne({ slug }).lean();
    if (!career) {
      return NextResponse.json(
        { success: false, message: "Career listing not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, career }, { status: 200 });
  } catch (error) {
    console.error("Error fetching career listing:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  try {
    await dbConnect();
    await verifyAdmin(req);

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "Request body is empty." },
        { status: 400 }
      );
    }

    const updated = await Career.findOneAndUpdate(
      { slug },
      { $set: normalizeCareerPayload(body) },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Career listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Career listing updated", career: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating career listing:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A career listing with this slug already exists." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  try {
    await dbConnect();
    await verifyAdmin(req);

    const deleted = await Career.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Career listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Career listing deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting career listing:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
