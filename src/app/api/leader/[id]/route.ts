import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { verifyAdmin } from "@/utils/validator";
import Leader from "@/models/LeaderInfo";

export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const asyncParams = await params;
    const _id = asyncParams.id;
    try {
        await connectToDatabase();

        const leaderData = await Leader.findOne({ _id });
        return NextResponse.json(
            { error: true, leaderData },
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

        const leaderData = await Leader.findByIdAndUpdate(_id, { ...body }, { new: true });
        return NextResponse.json(
            { success: true, leaderData },
            { status: 200 }
        );
    }
    catch (err: any) {
        console.error('Error during updating leader info:', err);

        if (err?.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Duplicate entry in leader data." },
                { status: 409 }
            );
        }

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

        const result = await Leader.findByIdAndDelete(_id);
        return NextResponse.json(
            { success: true, result },
            { status: 200 }
        );
    }
    catch (err) {
        console.error('Error deleting leader info:', err);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }

}
