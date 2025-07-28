import connectToDatabase from "@/lib/dbConnect";
import Posts from "@/models/Posts";

import {  NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const blogs = await Posts.find({postType:'blog'}).select('slug -_id')

        return NextResponse.json(
            {
                success: true,
                blogs
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching blogs from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};