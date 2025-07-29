import connectToDatabase from "@/lib/dbConnect";
import Team from "@/models/TeamInfo";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const data = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing team data" },
                { status: 400 }
            );
        }

        const teamData = await Team.create(data);


        return NextResponse.json(
            { success: true, message: "Team data added", teamData },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Team info exists in the database" },
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
        const teamData = await Team.find({});
        return NextResponse.json(
            {
                success: true,
                teamData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching team data database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};