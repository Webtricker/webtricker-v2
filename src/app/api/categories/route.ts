import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Post from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
    try {
        await dbConnect();
        const categories = await Category.find({ name: { $ne: "Uncategorized" } }).select('name').lean();
        const postCounts = await Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        const countMap: Record<string, number> = {};
        postCounts.forEach((c: any) => { if (c._id) countMap[c._id.toString()] = c.count; });
        const result = categories.map((cat: any) => ({ ...cat, postCount: countMap[cat._id.toString()] ?? 0 }));

        return NextResponse.json({
            success: true,
            categories: result,
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
    try {
        const { name } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json({
                message: "Category name is required",
                success: false,
            }, { status: 400 });
        }

        await dbConnect();
        await verifyAdmin(req);
        const res = await Category.create({ name });
        return NextResponse.json({
            success: true,
            message: "Category created successfully.",
            category: res,
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
