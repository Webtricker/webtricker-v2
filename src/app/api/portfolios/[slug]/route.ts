
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { verifyAdmin } from "@/utils/validator";
import Portfolio from "@/models/Portfolio";


export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;

    // --- API Key Validation (Crucial!) ---
    try {
        await connectToDatabase();

        const res = await Portfolio.findOne({ slug });

        if (!res) {
            return NextResponse.json(
                { success: false, error: true, message: "Portfolio not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                portfolio: res,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error getting post:', error);
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
    const { slug: blogID } = await params;
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const deletedPortfolio = await Portfolio.findByIdAndDelete(blogID);

        if (!deletedPortfolio) {
            return NextResponse.json(
                { success: false, error: true, message: 'Portfolio not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Portfolio deleted successfully',
                deletedPortfolio,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting portfolio post:', error);
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

        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { slug },
            { $set: body },
            {
                new: true, // return the updated document
                runValidators: true,
            }
        )

        if (!updatedPortfolio) {
            return NextResponse.json(
                { success: false, message: "Portfolio not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Portfolio "${slug}" updated successfully.`,
                portfolio: updatedPortfolio,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};