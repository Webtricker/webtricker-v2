import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Blogs";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        const authorization = req.headers.get('authorization');

        // --- API Key Validation (Crucial!) ---
        const API_KEY = process.env.WORDPRESS_API_KEY;
        if (!API_KEY || authorization !== `Bearer ${API_KEY}`) {
            console.error('Unauthorized attempt for delete:', authorization);
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }


        await connectToDatabase();

        const { data } = await req.json() || {};
        console.log(data)
        if (!data) {
            // If no data, return error
            return NextResponse.json(
                { success: false, error: true, message: "Missing post data" },
                { status: 400 }
            );
        }

        if (!data?.wordpress_post_id) {
            return NextResponse.json(
                { success: false, error: true, message: "Post ID is required" },
                { status: 400 }
            );
        }

        await Post.findOneAndDelete({ wordpress_post_id: data?.wordpress_post_id })

        const newPost = new Post(data);
        await newPost.save()

        return NextResponse.json(
            { success: true, error: false, message: "success" },
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
