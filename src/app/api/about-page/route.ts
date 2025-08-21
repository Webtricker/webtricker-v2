import connectToDatabase from "@/lib/dbConnect";
import About from "@/models/AboutPage";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        // Expect a single data object from the request body
        const { id, data } = await req.json();

        // Check if the data and its ID are present
        if (!id) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing document ID" },
                { status: 400 }
            );
        }

        // Use the _id from the data object to find and update
        const aboutHomeData = await About.findByIdAndUpdate(id, data);

        // If no document was found with that ID, handle the case
        if (!aboutHomeData) {
            return NextResponse.json(
                { success: false, error: true, message: "Document not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Data updated", data: aboutHomeData },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const GET = async () => {
    try {
        await connectToDatabase();

        const data = await About.findOne().lean();

        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching about page data.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};