import dbConnect from "@/lib/dbConnect";
import Portfolio from "@/models/Portfolio";
import Technology from "@/models/Technology";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
    try {
        await dbConnect();
        const technologies = await Technology.find().select('name').lean();
        const portfolioCounts = await Portfolio.aggregate([{ $group: { _id: '$technology', count: { $sum: 1 } } }]);
        const countMap: Record<string, number> = {};
        portfolioCounts.forEach((c: any) => { if (c._id) countMap[c._id.toString()] = c.count; });
        const result = technologies.map((tech: any) => ({ ...tech, portfolioCount: countMap[tech._id.toString()] ?? 0 }));

        return NextResponse.json({
            success: true,
            technologies: result,
        }, { status: 200 })
    } catch (error) {
        console.log(error, ' error occured during fetching technologies')

        return NextResponse.json({
            message: "Failed to get technologies",
            success: false,
        }, { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { name } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json({
                message: "Technology name is required",
                success: false,
            }, { status: 400 });
        }

        await dbConnect();
        await verifyAdmin(req);
        const res = await Technology.create({ name });
        return NextResponse.json({
            success: true,
            message: "Portfolio technology added.",
            technology: res,
        }, { status: 200 })
    } catch (error: any) {
        console.log(error, ' error occured adding technology')
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Technology already exists.' });
        }
        return NextResponse.json({
            message: "Failed to post technology",
            error,
            success: false,
        }, { status: 500 })
    }
}
