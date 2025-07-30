import connectToDatabase from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonials";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const data = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing Testimonial data" },
                { status: 400 }
            );
        }

        const testimonialsData = await Testimonial.create(data);


        return NextResponse.json(
            { success: true, message: "Testimonial data added", testimonialsData },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Testimonial data exists in the database" },
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
        const testimonialsData = await Testimonial.find({});
        return NextResponse.json(
            {
                success: true,
                testimonialsData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching testimonial data.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};