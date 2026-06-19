import connectToDatabase from "@/lib/dbConnect";
import Portfolio from "@/models/Portfolio";
import "@/models/Technology";
import "@/models/Tag";
import { verifyAdmin } from "@/utils/validator";
import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";

const stripHtml = (value: string) =>
    value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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

export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { data } = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing portfolio data" },
                { status: 400 }
            );
        }

        const newPortfolio = new Portfolio(normalizePortfolioPayload(data));
        await newPortfolio.save()

        return NextResponse.json(
            { success: true, message: "success" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error adding portfolio to database. ', error);

        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Portfolio already exists.' });
        }
        return NextResponse.json(
            { success: false, error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};



export const GET = async (req: NextRequest) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const technologyId = searchParams.get("technologyId") || null;
        const search = searchParams.get("search")?.trim();
        const tag = searchParams.get("tag")?.trim();
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        const query: any = {};
        const andConditions: any[] = [];
        if (technologyId && mongoose.Types.ObjectId.isValid(technologyId)) {
            query['technology'] = new mongoose.Types.ObjectId(technologyId);
        } else if (technologyId) {
            return NextResponse.json(
                { success: false, message: 'Invalid technologyId' },
                { status: 400 }
            );
        }
        if (tag) query.tags = asObjectId(tag);
        if (search) {
            andConditions.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { excerp: { $regex: search, $options: "i" } },
                    { liveLink: { $regex: search, $options: "i" } },
                ],
            });
        }
        if (andConditions.length) query.$and = andConditions;

        const [portfolios, total] = await Promise.all([
            Portfolio.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('technology')
                .populate('tags')
                .lean(),
            Portfolio.countDocuments(query)
        ]);

        return NextResponse.json(
            {
                success: true,
                portfolios: portfolios.map(normalizePortfolioForResponse),
                pagination: {
                    total,
                    page,
                    limit
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching portfolios from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
