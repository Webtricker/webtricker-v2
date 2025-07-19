import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { data } = await req.json() || {};
        if (!data) {
            // If no data, return error
            return NextResponse.json(
                { success: false, error: true, message: "Missing post data" },
                { status: 400 }
            );
        }

        const newPost = new Post(data);
        await newPost.save()

        return NextResponse.json(
            { success: true, message: "success" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error adding post to database. ', error);
        return NextResponse.json(
            { success: false, error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
