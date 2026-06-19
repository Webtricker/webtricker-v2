import connectToDatabase from "@/lib/dbConnect";
import Tag from "@/models/Tag";
import { makeSlug } from "@/utils/blog";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireTagEditor, sanitizeTag } from "../_utils";

const invalidIdResponse = () =>
  NextResponse.json(
    { success: false, error: true, message: "Invalid tag id" },
    { status: 400 }
  );

const isValidHexColor = (value: unknown) =>
  typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireTagEditor(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    await connectToDatabase();
    const tag = await Tag.findById(id);

    if (!tag) {
      return NextResponse.json(
        { success: false, error: true, message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, tag: sanitizeTag(tag) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireTagEditor(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.name !== undefined) update.name = body.name;
    if (body.slug !== undefined) {
      const slug = makeSlug(body.slug);

      if (!slug) {
        return NextResponse.json(
          { success: false, error: true, message: "Slug is required" },
          { status: 400 }
        );
      }

      update.slug = slug;
    }
    if (body.color !== undefined) {
      if (!isValidHexColor(body.color)) {
        return NextResponse.json(
          { success: false, error: true, message: "Invalid color" },
          { status: 400 }
        );
      }

      update.color = body.color;
    }

    await connectToDatabase();
    const tag = await Tag.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return NextResponse.json(
        { success: false, error: true, message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, tag: sanitizeTag(tag) },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: true, message: "Tag already exists" },
        { status: 409 }
      );
    }

    console.error("Error updating tag:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireTagEditor(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    await connectToDatabase();
    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return NextResponse.json(
        { success: false, error: true, message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tag deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
