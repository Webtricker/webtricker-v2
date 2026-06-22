import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { verifyAdmin } from "@/utils/validator";
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
export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) => {
    const { categoryId: id } = await params;
    try {
        await dbConnect();
        await verifyAdmin(req);
        const { name } = await req.json();
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
        }
        const updated = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Category updated', category: updated }, { status: 200 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Category already exists.' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
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
