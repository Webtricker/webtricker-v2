import connectToDatabase from "@/lib/dbConnect";
import Tag from "@/models/Tag";
import { makeSlug } from "@/utils/blog";
import { NextRequest, NextResponse } from "next/server";
import { requireTagEditor, sanitizeTag } from "./_utils";

const normalizeHexColor = (value: unknown) =>
  typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ? value
    : "#4F46E5";

export const GET = async (req: NextRequest) => {
  const forbiddenResponse = requireTagEditor(req);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    await connectToDatabase();
    const tags = await Tag.find({}).sort({ name: 1 });

    return NextResponse.json(
      { success: true, tags: tags.map(sanitizeTag) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const forbiddenResponse = requireTagEditor(req);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    const { name, slug, color } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: true, message: "Name is required" },
        { status: 400 }
      );
    }

    const tagSlug = makeSlug(slug || name);

    if (!tagSlug) {
      return NextResponse.json(
        { success: false, error: true, message: "Slug is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const tag = await Tag.create({
      name,
      slug: tagSlug,
      color: normalizeHexColor(color),
    });

    return NextResponse.json(
      { success: true, tag: sanitizeTag(tag) },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: true, message: "Tag already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating tag:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
