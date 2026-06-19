import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";
import Tag from "@/models/Tag";
import { verifyAdmin } from "@/utils/validator";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const asObjectId = (value: unknown) =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : value;

const normalizeThumbnail = (value: unknown) => {
  if (typeof value === "string") return { url: value };
  return value;
};

const normalizePostPayload = (body: Record<string, any>) => {
  const plainContent = stripHtml(body.content || "");
  const description =
    body.description || body.seoDescription || body.excerp || plainContent.slice(0, 160);
  const excerp = body.excerp || body.seoDescription || plainContent.slice(0, 160);

  return {
    ...body,
    description,
    excerp,
    postType: "blog",
    thumnail: normalizeThumbnail(body.thumnail),
    category: asObjectId(body.category),
    tags: Array.isArray(body.tags) ? body.tags.map(asObjectId) : [],
  };
};

const normalizeTagForResponse = (tag: any) => ({
  id: String(tag._id || tag.id || tag),
  name: tag.name || String(tag),
  slug: tag.slug || "",
  color: tag.color || "#4F46E5",
});

const attachResolvedTags = async (posts: any[]) => {
  const rawTagValues = posts.flatMap((post) => (Array.isArray(post.tags) ? post.tags : []));
  const objectIdStrings = rawTagValues
    .map((tag) => String(tag?._id || tag))
    .filter((tag) => mongoose.Types.ObjectId.isValid(tag));

  const tagDocs = objectIdStrings.length
    ? await Tag.find({ _id: { $in: objectIdStrings } }).lean()
    : [];
  const tagById = new Map(tagDocs.map((tag: any) => [String(tag._id), tag]));

  return posts.map((post) => ({
    ...post,
    tags: (Array.isArray(post.tags) ? post.tags : []).map((tag: any) => {
      if (tag?.name) return normalizeTagForResponse(tag);
      const tagId = String(tag?._id || tag);
      const tagDoc = tagById.get(tagId);
      return tagDoc ? normalizeTagForResponse(tagDoc) : normalizeTagForResponse(tag);
    }),
  }));
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { postType: "blog" };
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const tag = searchParams.get("tag")?.trim();
    const status = searchParams.get("status")?.trim();

    const andConditions: Record<string, any>[] = [];

    if (search) {
      andConditions.push({
        $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { excerp: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (category && mongoose.Types.ObjectId.isValid(category)) query.category = category;
    if (tag) query.tags = asObjectId(tag);
    if (status === "published") query.published = true;
    if (status === "draft") {
      andConditions.push({
        $or: [{ published: false }, { published: { $exists: false } }],
      });
    }
    if (andConditions.length) query.$and = andConditions;

    const [count, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("tags")
        .lean(),
    ]);

    const resolvedPosts = await attachResolvedTags(posts);

    return NextResponse.json(
      {
        success: true,
        posts: resolvedPosts,
        count,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.max(1, Math.ceil(count / limit)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    await verifyAdmin(req);

    const body = await req.json();
    const data = body?.data || body;

    if (!data) {
      return NextResponse.json(
        { success: false, error: true, message: "Missing post data" },
        { status: 400 }
      );
    }

    const newPost = await Post.create(normalizePostPayload(data));

    return NextResponse.json(
      { success: true, message: "Post added", post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding post to database. ", error);
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: true, message: "Post slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
