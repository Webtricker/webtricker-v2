import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
    _: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) => {
    const asyncParams = await params;
    const id = asyncParams.categoryId;
    try {
        await dbConnect();

        await Category.findByIdAndDelete(id)
        return NextResponse.json(
            { success: true, message: 'Category deleted' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during category deletion:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) => {
    const asyncParams = await params;
    const id = asyncParams.categoryId;
    try {
        await dbConnect();

        const category = await Category.findById(id).select('name').lean()
        return NextResponse.json(
            { success: true, category: category },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
