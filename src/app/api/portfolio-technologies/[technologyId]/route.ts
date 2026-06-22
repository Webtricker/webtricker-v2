import dbConnect from "@/lib/dbConnect";
import Technology from "@/models/Technology";
import { verifyAdmin } from "@/utils/validator";
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
export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ technologyId: string }> }
) => {
    const { technologyId: id } = await params;
    try {
        await dbConnect();
        await verifyAdmin(req);
        const { name } = await req.json();
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
        }
        const updated = await Technology.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, message: 'Technology not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Technology updated', technology: updated }, { status: 200 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Technology already exists.' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
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
