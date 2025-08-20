import connectToDatabase from "@/lib/dbConnect";
import Leader from "@/models/LeaderInfo";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const data = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing leader data" },
                { status: 400 }
            );
        }

        const leaderData = await Leader.create(data);


        return NextResponse.json(
            { success: true, message: "Leader data added", leaderData },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Leader info exists in the database" },
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
        const leaderData = await Leader.find({});
        return NextResponse.json(
            {
                success: true,
                leaderData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching leader data database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};