
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { verifyAdmin } from "@/utils/validator";
import Service from "@/models/Service";


export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;

    try {
        await connectToDatabase();

        const res = await Service.findOne({ slug })

        if (!res) {
            return NextResponse.json(
                { success: false, error: true, message: "Service not found" },
                { status: 404 }
            );
        }

        // Attempt to find older Service
        let prevService = await Service.findOne({
            createdAt: { $lt: res.createdAt },
        }).sort({ createdAt: -1 });

        // Wrap around to latest if no older post
        if (!prevService) {
            prevService = await Service.findOne({
                slug: { $ne: slug }, // exclude current
            }).sort({ createdAt: -1 });
        }

        // Attempt to find newer post
        let nextService = await Service.findOne({
            createdAt: { $gt: res.createdAt },
        }).sort({ createdAt: 1 });

        // Wrap around to oldest if no newer post
        if (!nextService) {
            nextService = await Service.findOne({
                slug: { $ne: slug },
            }).sort({ createdAt: 1 });
        }

        return NextResponse.json(
            {
                success: true,
                post: res,
                prevPost: prevService || null,
                nextPost: nextService || null
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during service query:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const { slug: serviceID } = await params;
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const deletedService = await Service.findByIdAndDelete(serviceID);

        if (!deletedService) {
            return NextResponse.json(
                { success: false, error: true, message: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Service deleted successfully',
                deletedService,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { slug } = await params;

        const body = await req.json();

        // Optional: validate input here
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { success: false, message: "Request body is empty." },
                { status: 400 }
            );
        }

        const updatedService = await Service.findOneAndUpdate(
            { slug },
            { $set: body },
            {
                new: true, // return the updated document
                runValidators: true,
            }
        )

        if (!updatedService) {
            return NextResponse.json(
                { success: false, message: "Service not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Service "${slug}" updated successfully.`,
                post: updatedService,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};