import dbConnect from "@/lib/dbConnect";
import Technology from "@/models/Technology";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
    _: NextRequest,
    { params }: { params: Promise<{ technologyId: string }> }
) => {
    const asyncParams = await params;
    const id = asyncParams.technologyId;
    try {
        await dbConnect();

        await Technology.findByIdAndDelete(id)
        return NextResponse.json(
            { success: true, message: 'Technology deleted' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during technology deletion:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ technologyId: string }> }
) => {
    const asyncParams = await params;
    const id = asyncParams.technologyId;
    try {
        await dbConnect();

        const technology = await Technology.findById(id).select('name').lean()
        return NextResponse.json(
            { success: true, technology },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching technology:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
