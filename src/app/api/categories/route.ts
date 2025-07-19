import dbConnect from "@/lib/dbConnect";
import Categories from "@/models/Categories"
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
    try {
        await dbConnect();
        const categories = await Categories.find().select('name').lean();

        return NextResponse.json({
            success: true,
            categories,
        }, { status: 200 })
    } catch (error) {
        console.log(error, ' error occured during fetching categories')

        return NextResponse.json({
            message: "Failed to get categories",
            success: false,
        }, { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
        return NextResponse.json({
            message: "Category name is required",
            success: false,
        }, { status: 400 });
    }
    try {

        await dbConnect();
        await verifyAdmin(req);
        await Categories.create({ name });
        return NextResponse.json({
            message: "Category created successfully.",
            category: name,
        }, { status: 200 })
    } catch (error: any) {
        console.log(error, ' error occured adding category')
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Category already exists.' });
        }
        return NextResponse.json({
            message: "Failed to post category",
            error,
            success: false,
        }, { status: 500 })
    }
}
