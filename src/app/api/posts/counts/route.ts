import connectToDatabase from "@/lib/dbConnect";
import Posts from "@/models/Posts";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const postType = searchParams.get("postType") || "blog";
        const categoryId = searchParams.get("categoryId") || null;

        const query: any = { postType };
        if (categoryId) {
            query['category._id'] = categoryId;
        }


        const counts = await Posts.countDocuments(query)

        return NextResponse.json(
            {
                success: true,
                counts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error counting posts from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};