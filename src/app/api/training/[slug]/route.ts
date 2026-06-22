import dbConnect from "@/lib/dbConnect";
import Training from "@/models/Training";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ slug: string }> };

export const GET = async (_: NextRequest, { params }: Params) => {
    const { slug } = await params;
    try {
        await dbConnect();
        const course = await Training.findOne({ slug }).lean();
        if (!course) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, course }, { status: 200 });
    } catch (error) {
        console.error("Error fetching training course:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
    const { slug } = await params;
    try {
        await dbConnect();
        await verifyAdmin(req);

        const body = await req.json();
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ success: false, message: "Request body is empty." }, { status: 400 });
        }

        const updated = await Training.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Course updated", course: updated }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating training course:", error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "A course with this slug already exists." }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
    const { slug } = await params;
    try {
        await dbConnect();
        await verifyAdmin(req);

        const deleted = await Training.findOneAndDelete({ slug });
        if (!deleted) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Course deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting training course:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
};
