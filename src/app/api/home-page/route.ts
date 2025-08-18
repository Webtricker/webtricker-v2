import connectToDatabase from "@/lib/dbConnect";
import Home from "@/models/HomePage";
import Posts from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";

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

export const GET = async () => {
    try {
        await connectToDatabase();

        const data = await Home.findOne().lean();

        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching home page data.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};