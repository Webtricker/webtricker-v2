import dbConnect from "@/lib/dbConnect";
import Training from "@/models/Training";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const published = searchParams.get("published");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "100", 10);
        const skip = (page - 1) * limit;

        const query: any = {};
        if (published === "true") query.published = true;

        const [courses, total] = await Promise.all([
            Training.find(query)
                .select("slug title thumbnail description packages featured published createdAt updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Training.countDocuments(query),
        ]);

        return NextResponse.json(
            { success: true, courses, pagination: { total, page, limit } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching training courses:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        await dbConnect();
        await verifyAdmin(req);

        const body = await req.json();
        if (!body || !body.slug || !body.title) {
            return NextResponse.json({ success: false, message: "slug and title are required" }, { status: 400 });
        }

        const course = new Training(body);
        await course.save();

        return NextResponse.json(
            { success: true, message: "Training course created", course },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating training course:", error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "A course with this slug already exists." }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
};
