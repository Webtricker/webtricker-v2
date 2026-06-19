
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { verifyAdmin } from "@/utils/validator";
import Service from "@/models/Service";
import mongoose from "mongoose";

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const asObjectId = (value: unknown) =>
    typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
        ? new mongoose.Types.ObjectId(value)
        : value;

const normalizeImage = (value: unknown) => {
    if (typeof value === "string") return { url: value };
    return value;
};

const normalizeServicePayload = (body: Record<string, any>) => {
    const plainContent = stripHtml(body.content || "");
    const description =
        body.description || body.seoDescription || body.excerpt || plainContent.slice(0, 160);
    const excerpt = body.excerpt || body.seoDescription || plainContent.slice(0, 160);

    return {
        ...body,
        description,
        excerpt,
        thumnail: normalizeImage(body.thumnail),
        tags: Array.isArray(body.tags) ? body.tags.map(asObjectId) : [],
        subServices: Array.isArray(body.subServices) ? body.subServices : [],
        featured: Boolean(body.featured),
        published: Boolean(body.published),
    };
};

const normalizeTagForResponse = (tag: any) => ({
    id: String(tag._id || tag.id || tag),
    name: tag.name || String(tag),
    slug: tag.slug || "",
    color: tag.color || "#4F46E5",
});

const normalizeServiceForResponse = (service: any) => ({
    ...service,
    id: String(service._id || service.id),
    tags: (Array.isArray(service.tags) ? service.tags : []).map(normalizeTagForResponse),
});

export const GET = async (
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;

    try {
        await connectToDatabase();

        const res = await Service.findOne({ slug })
            .populate("tags")
            .lean() as any;

        if (!res) {
            return NextResponse.json(
                { success: false, error: true, message: "Service not found" },
                { status: 404 }
            );
        }

        // Attempt to find older Service
        let prevService = await Service.findOne({
            createdAt: { $lt: res.createdAt },
        }).sort({ createdAt: -1 }).lean();

        // Wrap around to latest if no older post
        if (!prevService) {
            prevService = await Service.findOne({
                slug: { $ne: slug }, // exclude current
            }).sort({ createdAt: -1 }).lean();
        }

        // Attempt to find newer post
        let nextService = await Service.findOne({
            createdAt: { $gt: res.createdAt },
        }).sort({ createdAt: 1 }).lean();

        // Wrap around to oldest if no newer post
        if (!nextService) {
            nextService = await Service.findOne({
                slug: { $ne: slug },
            }).sort({ createdAt: 1 }).lean();
        }

        return NextResponse.json(
            {
                success: true,
                service: normalizeServiceForResponse(res),
                prevService: prevService || null,
                nextService: nextService || null
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
            { $set: normalizeServicePayload(body) },
            {
                new: true, // return the updated document
                runValidators: true,
            }
        )
            .populate("tags")
            .lean();

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
                service: updatedService ? normalizeServiceForResponse(updatedService) : null,
                post: updatedService ? normalizeServiceForResponse(updatedService) : null,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating service:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: `Category you entered matches an existing service` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};
