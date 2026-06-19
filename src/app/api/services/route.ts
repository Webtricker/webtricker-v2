import connectToDatabase from "@/lib/dbConnect";
import Service from "@/models/Service";
import { verifyAdmin } from "@/utils/validator";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const asObjectId = (value: unknown) =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : value;

const normalizeImage = (value: unknown) => {
  if (typeof value === "string") return { url: value };
  return value;
};

const normalizeServicePayload = (body: Record<string, any>) => {
  const plainContent = stripHtml(body.content || "");
  const description =
    body.description || body.seoDescription || body.excerpt || plainContent.slice(0, 160);
  const excerpt = body.excerpt || body.seoDescription || plainContent.slice(0, 160);

  return {
    ...body,
    description,
    excerpt,
    thumnail: normalizeImage(body.thumnail),
    tags: Array.isArray(body.tags) ? body.tags.map(asObjectId) : [],
    subServices: Array.isArray(body.subServices) ? body.subServices : [],
    featured: Boolean(body.featured),
    published: Boolean(body.published),
  };
};

const normalizeTagForResponse = (tag: any) => ({
  id: String(tag._id || tag.id || tag),
  name: tag.name || String(tag),
  slug: tag.slug || "",
  color: tag.color || "#4F46E5",
});

const normalizeServiceForResponse = (service: any) => ({
  ...service,
  id: String(service._id || service.id),
  tags: (Array.isArray(service.tags) ? service.tags : []).map(normalizeTagForResponse),
});

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    await verifyAdmin(req);

    const { data } = (await req.json()) || {};
    if (!data) {
      return NextResponse.json(
        { success: false, error: true, message: "Missing service data" },
        { status: 400 }
      );
    }

    const service = new Service(normalizeServicePayload(data));
    await service.save();

    return NextResponse.json(
      { success: true, message: "Service added", service },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "Service exists in the database",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "99", 10);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const tag = searchParams.get("tag")?.trim();

    await connectToDatabase();

    const query: Record<string, any> = {};
    const andConditions: Record<string, any>[] = [];

    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (category) query.category = category;
    if (tag) query.tags = asObjectId(tag);
    if (andConditions.length) query.$and = andConditions;

    const services = await Service.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate("tags")
      .lean();

    return NextResponse.json(
      {
        success: true,
        services: services.map(normalizeServiceForResponse),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services from database.", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
