
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { verifyAdmin } from "@/utils/validator";
import Portfolio from "@/models/Portfolio";
import "@/models/Technology";
import "@/models/Tag";
import mongoose from "mongoose";

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const asObjectId = (value: unknown) =>
    typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
        ? new mongoose.Types.ObjectId(value)
        : value && typeof value === "object" && "_id" in value && mongoose.Types.ObjectId.isValid(String((value as any)._id))
            ? new mongoose.Types.ObjectId(String((value as any)._id))
            : value;

const normalizeImage = (value: unknown) => {
    if (typeof value === "string") return { url: value };
    return value;
};

const normalizePortfolioPayload = (body: Record<string, any>) => {
    const plainContent = stripHtml(body.content || "");
    const description = body.description || body.seoDescription || body.excerp || plainContent.slice(0, 160);
    const excerp = body.excerp || body.seoDescription || plainContent.slice(0, 160);

    return {
        ...body,
        description,
        excerp,
        technology: asObjectId(body.technology),
        tags: Array.isArray(body.tags) ? body.tags.map(asObjectId) : [],
        thumnail: normalizeImage(body.thumnail),
        coverImage: normalizeImage(body.coverImage),
        featured: Boolean(body.featured),
    };
};

const normalizeTagForResponse = (tag: any) => ({
    id: String(tag._id || tag.id || tag),
    name: tag.name || String(tag),
    slug: tag.slug || "",
    color: tag.color || "#4F46E5",
});

const normalizePortfolioForResponse = (portfolio: any) => ({
    ...portfolio,
    id: String(portfolio._id || portfolio.id),
    tags: (Array.isArray(portfolio.tags) ? portfolio.tags : []).map(normalizeTagForResponse),
});


export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;

    // --- API Key Validation (Crucial!) ---
    try {
        await connectToDatabase();

        const res = await Portfolio.findOne({ slug })
            .populate('technology')
            .populate('tags')
            .lean();

        if (!res) {
            return NextResponse.json(
                { success: false, error: true, message: "Portfolio not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                portfolio: normalizePortfolioForResponse(res),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error getting post:', error);
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
    const { slug: blogID } = await params;
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const deletedPortfolio = await Portfolio.findByIdAndDelete(blogID);

        if (!deletedPortfolio) {
            return NextResponse.json(
                { success: false, error: true, message: 'Portfolio not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Portfolio deleted successfully',
                deletedPortfolio,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting portfolio post:', error);
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

        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { slug },
            { $set: normalizePortfolioPayload(body) },
            {
                new: true, // return the updated document
                runValidators: true,
            }
        )
            .populate('technology')
            .populate('tags')
            .lean()

        if (!updatedPortfolio) {
            return NextResponse.json(
                { success: false, message: "Portfolio not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Portfolio "${slug}" updated successfully.`,
                portfolio: updatedPortfolio ? normalizePortfolioForResponse(updatedPortfolio) : null,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};
