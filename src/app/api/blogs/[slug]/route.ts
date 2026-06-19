
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";
import mongoose from "mongoose";

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
        thumnail: normalizeThumbnail(body.thumnail),
        category: asObjectId(body.category),
        tags: Array.isArray(body.tags) ? body.tags.map(asObjectId) : [],
    };
};

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;
    // --- API Key Validation (Crucial!) ---
    try {
        await connectToDatabase();

        const res = await Post.findOne({ slug })
            .populate('category')
            .populate('tags');

        if (!res) {
            return NextResponse.json(
                { success: false, error: true, message: "Post not found" },
                { status: 404 }
            );
        }

        // Attempt to find older post
        let prevPost = await Post.findOne({
            category: res.category._id,
            createdAt: { $lt: res.createdAt },
        })
            .sort({ createdAt: -1 });

        // Wrap around to latest if no older post
        if (!prevPost) {
            prevPost = await Post.findOne({
                category: res.category._id,
                slug: { $ne: slug }, // exclude current
            }).sort({ createdAt: -1 });
        }

        // Attempt to find newer post
        let nextPost = await Post.findOne({
            category: res.category._id,
            createdAt: { $gt: res.createdAt },
        })
            .sort({ createdAt: 1 });

        // Wrap around to oldest if no newer post
        if (!nextPost) {
            nextPost = await Post.findOne({
                category: res.category._id,
                slug: { $ne: slug },
            }).sort({ createdAt: 1 });
        }


        return NextResponse.json(
            {
                success: true,
                post: res,
                prevPost: prevPost || null,
                nextPost: nextPost || null
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during post deletion:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const { slug:blogID } = await params;
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const deletedPost = await Post.findByIdAndDelete(blogID);

        if (!deletedPost) {
            return NextResponse.json(
                { success: false, error: true, message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Post deleted successfully',
                deletedPost,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { slug } = await params;

        const body = await req.json();

        // Optional: validate input here
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { success: false, message: "Request body is empty." },
                { status: 400 }
            );
        }

        const updatedPost = await Post.findOneAndUpdate(
            { slug },
            { $set: normalizePostPayload(body) },
            {
                new: true, // return the updated document
                runValidators: true,
            }
        )
            .populate("category")
            .populate("tags");

        if (!updatedPost) {
            return NextResponse.json(
                { success: false, message: "Post not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Post "${slug}" updated successfully.`,
                post: updatedPost,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};
