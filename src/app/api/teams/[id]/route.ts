import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Team from "@/models/TeamInfo";
import { verifyAdmin } from "@/utils/validator";

export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const asyncParams = await params;
    const _id = asyncParams.id;
    try {
        await connectToDatabase();

        const teamData = await Team.findOne({ _id });
        return NextResponse.json(
            { error: true, teamData },
            { status: 200 }
        );
    }
    catch (err) {
        console.error('Error during post deletion:', err);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }

}

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const asyncParams = await params;
    const _id = asyncParams.id;

    try {
        await verifyAdmin(req);
        await connectToDatabase();

        const body = await req.json();

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { success: false, message: "Request body is empty." },
                { status: 400 }
            );
        }

        const teamData = await Team.findByIdAndUpdate(_id, { ...body }, { new: true });
        return NextResponse.json(
            { error: true, teamData },
            { status: 200 }
        );
    }
    catch (err) {
        console.error('Error during updating team info:', err);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }

}

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const asyncParams = await params;
    const _id = asyncParams.id;

    try {
        await verifyAdmin(req);
        await connectToDatabase();

        const result = await Team.findByIdAndDelete(_id);
        return NextResponse.json(
            { success: true, result },
            { status: 200 }
        );
    }
    catch (err) {
        console.error('Error deleting team info:', err);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }

}
