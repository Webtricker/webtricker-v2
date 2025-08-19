import connectToDatabase from "@/lib/dbConnect";
import Home from "@/models/HomePage";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const PUT = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const data = await req.json() || {};
        console.log(data, ' data from home page posts')
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing post data" },
                { status: 400 }
            );
        }

        const homeData = new Home(data);
        await homeData.save()

        return NextResponse.json(
            { success: true, message: "Data updated",homeData },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
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