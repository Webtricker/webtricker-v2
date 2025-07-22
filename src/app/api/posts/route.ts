import connectToDatabase from "@/lib/dbConnect";
import Posts from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";
import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { data } = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing post data" },
                { status: 400 }
            );
        }

        const post = new Posts(data);
        await post.save()

        return NextResponse.json(
            { success: true, message: "Post added" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Post exists in the database" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
    ;

export const GET = async (req: NextRequest) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const postType = searchParams.get("postType") || "blog";
        const categoryId = searchParams.get("categoryId") || null;
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        const query: any = { postType };

        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
             query['category'] = new mongoose.Types.ObjectId(categoryId);
        } else if (categoryId) {
            return NextResponse.json(
                { success: false, message: 'Invalid categoryId' },
                { status: 400 }
            );
        }

        const [posts, total] = await Promise.all([
            Posts.find(query).skip(skip).limit(limit),
            Posts.countDocuments(query)
        ]);

        return NextResponse.json(
            {
                success: true,
                posts,
                pagination: {
                    total,
                    page,
                    limit
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching posts from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};